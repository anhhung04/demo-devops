from fastapi import APIRouter, Depends, status
from utils.api import APIResponse

from services.auth import AuthService

from models.dto.user import AuthResponseModel, UserRequest, NewUserResponseModel, NewUserRequest

router = APIRouter()


@router.post("/signin", tags=["auth"], response_model=AuthResponseModel)
async def signin(
    user: UserRequest,
    service: AuthService = Depends(AuthService),
):
    return APIResponse.as_json(
        code=status.HTTP_200_OK,
        status="Login successful",
        data={
            "token": await service.signin(user)
        }
    )


@router.post("/signup", tags=["auth"], response_model=NewUserResponseModel)
async def signup(
    user: NewUserRequest,
    service: AuthService = Depends(AuthService),
):
    return APIResponse.as_json(
        code=status.HTTP_201_CREATED,
        status="User created",
        data={
            "user": (await service.signup(user)).model_dump()
        }
    )
