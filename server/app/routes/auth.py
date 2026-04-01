from fastapi import APIRouter, HTTPException, status
from app.schemas.auth import LoginRequest, AuthResponse, UserResponse
from app.models.user import User
from app.services.auth_service import verify_password, create_access_token
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

    await log_action(
        user_name=user.name,
        action="LOGIN",
        entity="User",
        entity_id=user.uid,
        details=f"{user.name} logged in",
    )

    return AuthResponse(
        token=token,
        user=UserResponse(
            id=user.uid,
            name=user.name,
            email=user.email,
            role=user.role,
        ),
    )
