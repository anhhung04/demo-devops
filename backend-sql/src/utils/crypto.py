from repository import RedisStorage
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, Tuple
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


class JWTHandler:
    def __init__(self, store: Redis = Depends(RedisStorage.get)):
        self._store = store

    def verify(self, token: str) -> Tuple[Optional[dict], Exception]:
        _, payload, signature = token.split(".")
        try:
            payload = loads(urlsafe_b64decode(payload.encode()).decode())
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
            print(secret)
            self._store.set(uid, secret, ex=config["JWT_EXPIRATION"])
            print(self.sign(payload, secret))
            return ".".join([
                urlsafe_b64encode(
                    dumps({"alg": "HS256", "typ": "JWT"}).encode()
                ).decode(),
                urlsafe_b64encode(dumps(payload).encode()).decode(),
                self.sign(payload, secret)
            ])
        except Exception as e:
            return str(e)

    @staticmethod
    def sign(payload: dict, secret: str) -> str:
        payload = dumps({"alg": "HS256", "typ": "JWT"}) + "." + dumps(payload)
        return urlsafe_b64encode(new(key=secret.encode(), msg=payload.encode(), digestmod=sha256).digest()).decode()


def auth(token: HTTPAuthorizationCredentials = Depends(HTTPBearer()), jwt_handler: JWTHandler = Depends(JWTHandler)):
    cred = token.credentials
    if not cred:
        raise Exception("Invalid token")
    try:
        payload, error = jwt_handler.verify(cred)
        assert error is None, str(error)
        return payload
    except Exception as e:
        raise HTTPException(
            status_code=403,
            detail=str(e)
        )
