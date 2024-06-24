from pydantic import BaseModel
from typing import Optional


class UserModel(BaseModel):
    id: str
    slug: str
    email: str
    password: str
    display_name: str


class QueryUserModel(BaseModel):
    slug: Optional[str] = None
    email: Optional[str] = None
    id: Optional[str] = None
