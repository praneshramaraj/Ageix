from typing import Generator, List
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from app.config import settings
from app.core.security import decode_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def get_current_user_claims(token: str = Depends(oauth2_scheme)) -> dict:
    payload = decode_token(token)
    return payload

class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, claims: dict = Depends(get_current_user_claims)):
        user_roles = claims.get("roles", [])
        # Super Admin bypass
        if "Super Admin" in user_roles:
            return claims
            
        has_role = any(role in self.allowed_roles for role in user_roles)
        if not has_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User does not have required permissions ({', '.join(self.allowed_roles)})"
            )
        return claims

require_super_admin = RoleChecker(["Super Admin"])
require_admin = RoleChecker(["Super Admin", "Admin"])
require_dispatcher = RoleChecker(["Super Admin", "Admin", "Dispatcher", "Rescue Commander"])
require_rescuer = RoleChecker(["Super Admin", "Admin", "Dispatcher", "Rescue Commander", "Team Leader", "Rescuer"])
