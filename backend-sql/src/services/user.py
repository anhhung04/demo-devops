from fastapi import HTTPException, Depends

from repository.user import UserRepository

from models.dto.user import UserResponse
from models.user import QueryUserModel

from utils.crypto import auth

from uuid import UUID


class UserService:
    def __init__(self, repo: UserRepository = Depends(UserRepository)) -> None:
        self._repo = repo

    def get(self, user_id: str = "") -> UserResponse:
        try:
            try:
                _ = UUID(user_id)
                query = QueryUserModel(id=user_id)
            except:
                if "@" in user_id:
                    query = QueryUserModel(email=user_id)
                else:
                    query = QueryUserModel(slug=user_id)
            user = self._repo.find_one(query=query)
            assert user is not None, "Please login first!"
            return UserResponse(
                id=user.id, slug=user.slug, email=user.email, display_name=user.display_name
            )
        except Exception as e:
            raise HTTPException(
                status_code=204, detail=str(e)
            )
