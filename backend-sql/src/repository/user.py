from fastapi import Depends
from repository import Storage
from repository.schema.user import User
from typing import Optional
from models.user import UserModel, QueryUserModel
from sqlalchemy.orm import Session


class UserRepository:
    def __init__(self, db: Session = Depends(Storage.get)):
        self._session = db

    def create(self, user: UserModel) -> Optional[User]:
        try:
            user = User(**user.model_dump())
            self._session.add(user)
            self._session.commit()
            self._session.refresh(user)
            return user
        except:
            self._session.rollback()
            return None

    def delete(self, user: User) -> bool:
        try:
            self._session.delete(user)
            self._session.commit()
            return True
        except:
            self._session.rollback()
            return False

    def find_one(self, query: QueryUserModel) -> Optional[User]:
        try:
            return self._session.query(User).filter_by(**query.model_dump(exclude_none=True)).first()
        except:
            return None
