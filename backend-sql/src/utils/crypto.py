from repository import RedisStorage
from fastapi import Depends, HTTPException, Cookie
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, Tuple, Annotated
from hashlib import sha256, pbkdf2_hmac
from hmac import new
from base64 import urlsafe_b64encode, urlsafe_b64decode
from json import dumps, loads
from string import ascii_letters, digits
from random import choices
from redis import Redis
from config import config

class PasswordHandler:
    @staticmethod
    def hash(password: str) -> str:
        return urlsafe_b64encode(pbkdf2_hmac("sha256", password.encode(), config["PASSWORD_SALT"].encode(), 100000)).decode()

    @staticmethod
    def verify(password: str, hashed: str) -> bool:
        return hashed == PasswordHandler.hash(password)


class Base64:
    @staticmethod
    def encode(data: str) -> str:
        return urlsafe_b64encode(data.encode()).decode().rstrip('=')

    @staticmethod
    def decode(data: str) -> str:
        enc = data + '=' * (-len(data) % 4)
        return urlsafe_b64decode(enc.encode()).decode()


class JWTHandler:
    def __init__(self, store: Redis = Depends(RedisStorage.get)):
        self._store = store

    def verify(self, token: str) -> Tuple[Optional[dict], Exception]:
        _, payload, signature = token.split(".")
        try:
            payload = loads(Base64.decode(payload))
            uid = payload.get("uid", None)
            assert uid is not None
            secret = self._store.get(uid)
            if not secret:
                raise Exception("Invalid or expired token")
            if isinstance(secret, bytes):
                secret = secret.decode()
            assert signature == self.sign(payload, secret), "Invalid signature"
            return payload, None
        except Exception as e:
            return None, Exception(str(e))

    def create(self, payload: dict) -> str:
        try:
            secret = "".join(choices(ascii_letters + digits, k=64))
            uid = payload.get("uid", None)
            assert uid is not None
            self._store.set(uid, secret, ex=config["JWT_EXPIRATION"])
            return ".".join([
                Base64.encode(dumps({"alg": "HS256", "typ": "JWT"})),
                Base64.encode(dumps(payload)),
                self.sign(payload, secret)
            ])
        except Exception as e:
            return str(e)

    def revoke(self, uid: str) -> None:
        self._store.delete(uid)

    @staticmethod
    def sign(payload: dict, secret: str) -> str:
        payload = dumps({"alg": "HS256", "typ": "JWT"}) + "." + dumps(payload)
        return Base64.encode(new(secret.encode(), payload.encode(), sha256).hexdigest())


def get_cookie_token(token: Annotated[str | None, Cookie(alias="auth")] = None) -> Optional[str]:
    return token


def auth(
    token: HTTPAuthorizationCredentials = Depends(
        HTTPBearer(auto_error=False)
    ),
    jwt_handler: JWTHandler = Depends(JWTHandler),
    cookie_token: str = Depends(get_cookie_token),
):
    if not token:
        cred = cookie_token
    else:
        cred = token.credentials
    if not cred:
        raise Exception("No token provided")
    try:
        payload, error = jwt_handler.verify(cred)
        assert error is None, str(error)
        return payload
    except Exception as e:
        raise HTTPException(
            status_code=403,
            detail=str(e)
        )
