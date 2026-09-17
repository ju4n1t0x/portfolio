from fastapi import APIRouter, Depends, HTTPException, Request, Response, status

from ..controllers.auth_controller import TokenController
from ..middleware.auth import (
    ACCESS_COOKIE,
    REFRESH_COOKIE,
    ReuseDetected,
    cookie_kwargs,
    get_current_user,
    TokenPayload,
)
from ..models.token import TokenRequest, RefreshRequest, RefreshResponse

auth_router = APIRouter(prefix="/api/auth", tags=["auth"])

ACCESS_MAX_AGE = 30 * 60
REFRESH_MAX_AGE = 7 * 24 * 60 * 60


def get_token_controller():
    return TokenController()


def _set_auth_cookies(response: Response, access: str, refresh: str) -> None:
    response.set_cookie(ACCESS_COOKIE, access, **cookie_kwargs(ACCESS_MAX_AGE))
    response.set_cookie(REFRESH_COOKIE, refresh, **cookie_kwargs(REFRESH_MAX_AGE))


def _clear_auth_cookies(response: Response) -> None:
    response.delete_cookie(ACCESS_COOKIE, path="/")
    response.delete_cookie(REFRESH_COOKIE, path="/")


@auth_router.post("/token")
def get_token(
    response: Response,
    request: TokenRequest | None = None,
    controller: TokenController = Depends(get_token_controller),
):
    pair = controller.create_token(request)
    _set_auth_cookies(response, pair.access_token, pair.refresh_token)
    return {"ok": True, "token_type": "bearer"}


@auth_router.post("/refresh", response_model=RefreshResponse)
def refresh_token(
    request: Request,
    response: Response,
    body: RefreshRequest | None = None,
    controller: TokenController = Depends(get_token_controller),
):
    raw = request.cookies.get(REFRESH_COOKIE) or (body.refresh_token if body else None)
    if not raw:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing refresh token",
        )
    try:
        rotated = controller.rotate_raw(raw)
    except HTTPException as exc:
        if exc.detail == "Refresh token reused":
            _clear_auth_cookies(response)
        raise
    _set_auth_cookies(response, rotated.access_token, rotated.refresh_token)
    return RefreshResponse(access_token=rotated.access_token, token_type="bearer")


@auth_router.post("/logout")
def logout(request: Request, response: Response):
    raw = request.cookies.get(REFRESH_COOKIE)
    if raw:
        try:
            controller = TokenController()
            payload = controller.auth_service.verify_token(raw, "refresh")
            if payload.jti:
                controller.auth_service.store.revoke(payload.jti)
        except Exception:
            pass
    _clear_auth_cookies(response)
    return {"ok": True}


@auth_router.get("/verify")
def verify_token(current_user: TokenPayload = Depends(get_current_user)):
    return {"valid": True, "sub": current_user.sub}
