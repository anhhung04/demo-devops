from models.dto.response import ResponseModel
from pydantic import BaseModel
from typing import Optional


class OAuthRequestModel(BaseModel):
    issuer: str
    redirect_url: str


class TransferTokenRequestModel(BaseModel):
    state: str
    code: str
    error: Optional[str] = None


class AuthenticateResponseModel(ResponseModel):
    authentication_url: str


class OAuthResponseModel(ResponseModel):
    data: AuthenticateResponseModel
