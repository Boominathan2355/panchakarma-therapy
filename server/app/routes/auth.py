from fastapi import APIRouter, HTTPException, status
from app.schemas.auth import LoginRequest, AuthResponse, UserResponse, RefreshTokenRequest, RefreshTokenResponse
from app.models.user import User
from app.services.auth_service import verify_password, create_access_token, create_refresh_token, decode_refresh_token
from app.services.audit_service import log_action

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=AuthResponse)
async def login(credentials: LoginRequest):
    login_email = credentials.email or credentials.username
    if not login_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username is required",
        )
    user = await User.find_one(User.email == login_email)
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(user.uid, user.role)
    refresh_token = create_refresh_token(user.uid)

    await log_action(
        user_name=user.name,
        action="LOGIN",
        entity="User",
        entity_id=user.uid,
        details=f"{user.name} logged in",
    )

    return AuthResponse(
        token=token,
        refresh_token=refresh_token,
        user=UserResponse(
            id=user.uid,
            name=user.name,
            email=user.email,
            role=user.role,
        ),
    )


@router.post("/refresh", response_model=RefreshTokenResponse)
async def refresh_token(request: RefreshTokenRequest):
    payload = decode_refresh_token(request.refresh_token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token payload",
        )

    user = await User.find_one(User.uid == user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    new_access_token = create_access_token(user.uid, user.role)
    new_refresh_token = create_refresh_token(user.uid)

    await log_action(
        user_name=user.name,
        action="TOKEN_REFRESH",
        entity="User",
        entity_id=user.uid,
        details=f"{user.name} refreshed access token",
    )

    return RefreshTokenResponse(
        token=new_access_token,
        refresh_token=new_refresh_token,
    )
