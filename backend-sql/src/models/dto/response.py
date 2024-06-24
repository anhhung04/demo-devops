from pydantic import BaseModel
from typing import Optional


class ResponseModel(BaseModel):
    code: int
    status: str
