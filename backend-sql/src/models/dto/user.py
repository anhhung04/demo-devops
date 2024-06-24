from models.dto.response import ResponseModel
from pydantic import BaseModel


class NewUserRequest(BaseModel):
    email: str
    password: str
    display_name: str


class UserResponse(BaseModel):
    id: str
    slug: str
    email: str
    display_name: str


class UserRequest(BaseModel):
    email: str
    password: str


class NewUserResponseModel(ResponseModel):
    data: UserResponse


class AuthModel(BaseModel):
    token: str

class AuthResponseModel(ResponseModel):
    data: AuthModel


class UserResponseModel(ResponseModel):
    data: UserResponse
