from fastapi import HTTPException, status

from ..middleware.auth import AuthService, ReuseDetected
from ..models.token import TokenRequest, TokenResponse, RefreshRequest, RefreshResponse


class TokenController:
    def __init__(self):
        self.auth_service = AuthService()

    def create_token(self, request: TokenRequest | None = None) -> TokenResponse:
        if request and request.client_id and request.client_secret:
            if not self.auth_service.verify_credentials(request.client_id, request.client_secret):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid credentials",
                )
            return self.auth_service.create_token_response(request.client_id)
        return self.auth_service.issue_pair(self.auth_service.client_id)

    def refresh_token(self, request: RefreshRequest) -> RefreshResponse:
        try:
            return self.auth_service.refresh_access_token(request.refresh_token)
        except ReuseDetected:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token reused",
            )

    def rotate_raw(self, refresh_token: str) -> TokenResponse:
        try:
            return self.auth_service.rotate_refresh_token(refresh_token)
        except ReuseDetected:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token reused",
            )
