from fastapi import APIRouter, status, Depends

from models.dto.user import UserResponseModel

from services.user import UserService

from utils.api import APIResponse
from utils.crypto import auth

router = APIRouter()


@router.get("/me", tags=["user"], response_model=UserResponseModel)
async def me(
    user: dict = Depends(auth),
    service: UserService = Depends(UserService)
):
    return APIResponse.as_json(
        code=status.HTTP_200_OK,
        status="success",
        data=(service.get(user_id=user.get("uid", None))).model_dump()
    )
