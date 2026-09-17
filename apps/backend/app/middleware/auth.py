import os
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel

from ..models.token import TokenResponse, RefreshResponse
from ..services.refresh_store import RefreshStore


ACCESS_COOKIE = "access_token"
REFRESH_COOKIE = "refresh_token"


def _is_production() -> bool:
    return os.getenv("ENV", "dev").lower() in ("prod", "production")


def cookie_kwargs(max_age: int) -> dict:
    return {
        "httponly": True,
        "secure": _is_production(),
        "samesite": "lax",
        "path": "/",
        "max_age": max_age,
    }


class TokenPayload(BaseModel):
    sub: str
    exp: int
    type: str
    jti: Optional[str] = None


class ReuseDetected(Exception):
    pass


class AuthService:
    def __init__(self, store: RefreshStore | None = None):
        secret = os.getenv("SECRET_KEY")
        if not secret:
            raise RuntimeError("SECRET_KEY no configurada")
        self.secret_key = secret
        self.algorithm = "HS256"
        self.client_id = os.getenv("CLIENT_ID") or "portfolio-client"
        self.client_secret = os.getenv("CLIENT_SECRET") or ""
        self.access_token_expire_minutes = 30
        self.refresh_token_expire_days = 7
        self.store = store or RefreshStore()

    def verify_credentials(self, client_id: str, client_secret: str) -> bool:
        return client_id == self.client_id and client_secret == self.client_secret

    def _now(self) -> datetime:
        return datetime.now(timezone.utc)

    def create_access_token(self, subject: str) -> str:
        expire = self._now() + timedelta(minutes=self.access_token_expire_minutes)
        to_encode = {
            "sub": subject,
            "exp": int(expire.timestamp()),
            "type": "access",
        }
        return jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)

    def create_refresh_token(self, subject: str) -> str:
        jti = uuid.uuid4().hex
        expire = self._now() + timedelta(days=self.refresh_token_expire_days)
        self.store.issue(jti, subject, int(expire.timestamp()))
        to_encode = {
            "sub": subject,
            "exp": int(expire.timestamp()),
            "type": "refresh",
            "jti": jti,
        }
        return jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)

    def verify_token(self, token: str, expected_type: str) -> TokenPayload:
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            parsed = TokenPayload(**payload)
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            )
        if parsed.type != expected_type:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type",
            )
        if parsed.exp < int(self._now().timestamp()):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired",
            )
        return parsed

    def verify_access_token(self, token: str) -> TokenPayload:
        return self.verify_token(token, "access")

    def issue_pair(self, subject: str) -> TokenResponse:
        return TokenResponse(
            access_token=self.create_access_token(subject),
            refresh_token=self.create_refresh_token(subject),
            token_type="bearer",
        )

    def create_token_response(self, client_id: str) -> TokenResponse:
        return self.issue_pair(client_id)

    def rotate_refresh_token(self, refresh_token: str) -> TokenResponse:
        payload = self.verify_token(refresh_token, "refresh")
        if not payload.jti:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )
        if self.store.is_active(payload.jti):
            new_jti = uuid.uuid4().hex
            new_exp = self._now() + timedelta(days=self.refresh_token_expire_days)
            self.store.rotate(payload.jti, new_jti, payload.sub, int(new_exp.timestamp()))
            return TokenResponse(
                access_token=self.create_access_token(payload.sub),
                refresh_token=jwt.encode(
                    {
                        "sub": payload.sub,
                        "exp": int(new_exp.timestamp()),
                        "type": "refresh",
                        "jti": new_jti,
                    },
                    self.secret_key,
                    algorithm=self.algorithm,
                ),
                token_type="bearer",
            )
        if self.store.was_revoked(payload.jti):
            self.store.revoke_family(payload.sub)
            raise ReuseDetected()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    def refresh_access_token(self, refresh_token: str) -> RefreshResponse:
        rotated = self.rotate_refresh_token(refresh_token)
        return RefreshResponse(
            access_token=rotated.access_token,
            token_type="bearer",
        )


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)


def _token_from_request(request: Request, bearer: Optional[str]) -> Optional[str]:
    cookie_token = request.cookies.get(ACCESS_COOKIE)
    if cookie_token:
        return cookie_token
    if bearer:
        return bearer
    auth_header = request.headers.get("Authorization", "")
    if auth_header.lower().startswith("bearer "):
        return auth_header[7:]
    return None


def get_current_user(
    request: Request,
    bearer: Optional[str] = Depends(oauth2_scheme),
) -> TokenPayload:
    try:
        auth_service = AuthService()
    except RuntimeError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Auth misconfigured",
        )
    token = _token_from_request(request, bearer)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    return auth_service.verify_access_token(token)
