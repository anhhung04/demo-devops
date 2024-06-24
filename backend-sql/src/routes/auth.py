from fastapi import APIRouter, Depends, status, Response
from utils.api import APIResponse

from services.auth import AuthService

from models.dto.user import AuthResponseModel, UserRequest, NewUserResponseModel, NewUserRequest
from models.dto.response import ResponseModel

from utils.crypto import auth

router = APIRouter()


@router.post("/signin", tags=["auth"], response_model=AuthResponseModel)
async def signin(
    user: UserRequest,
    response: Response,
    service: AuthService = Depends(AuthService),
):
    access_token = service.signin(user)
    response = APIResponse.as_json(
        code=status.HTTP_200_OK,
        status="Login successful",
        data={
            "token": access_token
        }
    )
    response.set_cookie(
        "auth",
        access_token,
        httponly=True,
        samesite="strict",
        path="/api"
    )
    return response


@router.post("/signup", tags=["auth"], response_model=NewUserResponseModel)
async def signup(
    user: NewUserRequest,
    service: AuthService = Depends(AuthService),
):
    return APIResponse.as_json(
        code=status.HTTP_201_CREATED,
        status="User created",
        data={
            "user": (service.signup(user)).model_dump()
        }
    )


@router.post("/logout", tags=["auth"], response_model=ResponseModel)
async def logout(
    response: Response,
    service: AuthService = Depends(AuthService),
    user: dict = Depends(auth)
):
    uid = user.get("uid")
    service.logout(uid)
    response = APIResponse.as_json(
        code=status.HTTP_200_OK,
        status="Logout successful"
    )
    response.delete_cookie("auth")
    return response
