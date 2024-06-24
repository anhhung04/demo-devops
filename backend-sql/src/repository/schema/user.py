from sqlalchemy import Column, String
from repository.schema import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(String, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    display_name = Column(String)
