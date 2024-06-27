from repository.user import UserRepository
from repository import RedisStorage

from models.dto.user import NewUserRequest, UserResponse, UserRequest
from models.dto.auth import OAuthRequestModel, TransferTokenRequestModel
from models.user import QueryUserModel, UserModel

from utils.crypto import JWTHandler, PasswordHandler
from fastapi import Depends, HTTPException
from uuid import uuid4
from string import ascii_letters, digits
from random import choices
from config import config
from json import loads, dumps
from hashlib import sha256
from base64 import urlsafe_b64encode
from urllib.parse import quote_plus
from requests import post, get
from redis import Redis

class AuthService:
    def __init__(self, repo: UserRepository = Depends(UserRepository), jwt_handler: JWTHandler = Depends(JWTHandler), store: Redis = Depends(RedisStorage.get)) -> None:
        self._repo = repo
        self._jwt = jwt_handler
        self._store = store

    def signup(self, user: NewUserRequest) -> UserResponse:
        try:
            exist_user = self._repo.find_one(
                query=QueryUserModel(email=user.email)
            )
            assert exist_user is None, "User already exists"
            new_user = UserModel(
                id=str(uuid4()),
                slug=self.gen_slug(user.display_name),
                email=user.email,
                password=PasswordHandler.hash(user.password),
                display_name=user.display_name
            )
            new_user = self._repo.create(new_user)
            assert new_user is not None, "Failed to create user"
            new_user = UserResponse(
                id=new_user.id, slug=new_user.slug, email=new_user.email, display_name=new_user.display_name
            )
            return new_user
        except Exception as e:
            raise HTTPException(status_code=204, detail=str(e))

    def signin(self, user: UserRequest) -> str:
        try:
            exist_user = self._repo.find_one(
                query=QueryUserModel(email=user.email)
            )
            assert exist_user is not None, "User not found"
            assert PasswordHandler.verify(
                user.password, exist_user.password), "Invalid password"
            token = self._jwt.create({"uid": exist_user.id})
            assert token is not None, "Failed to create token"
            return token
        except Exception as e:
            raise HTTPException(status_code=204, detail=str(e))

    def logout(self, uid: str) -> None:
        try:
            self._jwt.revoke(uid)
        except Exception as e:
            raise HTTPException(status_code=204, detail=str(e))

    def request_oauth(self, oauth_request: OAuthRequestModel) -> str:
        service = oauth_request.issuer
        if service not in ["google"]:
            raise HTTPException(status_code=404, detail="Invalid service")

        try:
            client_id = config["OAUTH"][service]["client_id"]
            redirect_uri = config["OAUTH"][service]["redirect_uri"]
            auth_url = config["OAUTH"][service]["auth_url"]
            scope = " ".join(config["OAUTH"][service]["scope"])
            authentication_url = ""

            state = self.random_string(32)
            while self._store.get(state) is not None:
                state = self.random_string(32)

            if service == "google":
                def cm(cv):
                    return urlsafe_b64encode(
                        sha256(cv.encode()).digest()
                    ).decode().replace("=", "")

                cv, cc = self.gen_cc(cm)

                authentication_url = "".join([
                    auth_url, "?",
                    "client_id=", quote_plus(client_id),
                    "&redirect_uri=", quote_plus(redirect_uri),
                    "&scope=", quote_plus(scope),
                    "&state=", quote_plus(state),
                    "&code_challenge=", quote_plus(cc),
                    "&response_type=code",
                    "&code_challenge_method=S256"
                ])
            self._store.set(state, dumps({
                "cv": cv,
                "redirect_url": redirect_uri,
                "client_redirect_url": oauth_request.redirect_url,
                "issuer": service
            }), ex=300)

            return authentication_url

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    def transfer_token(self, transfer_token_request: TransferTokenRequestModel) -> str:
        try:
            assert transfer_token_request.error is None, transfer_token_request.error
            auth_data = str(self._store.get(
                transfer_token_request.state), "utf-8")
            assert auth_data is not None, "Invalid state"
            auth_data = loads(auth_data)
            service = auth_data["issuer"]
            cv = auth_data["cv"]
            redirect_url = auth_data["redirect_url"]
            service = auth_data["issuer"]
            token_url = config["OAUTH"][service]["token_url"]
            client_secret = config["OAUTH"][service]["client_secret"]
            client_id = config["OAUTH"][service]["client_id"]

            if service == "google":
                data = {
                    "client_id": client_id,
                    "client_secret": client_secret,
                    "code": transfer_token_request.code,
                    "redirect_uri": redirect_url,
                    "grant_type": "authorization_code",
                    "code_verifier": cv
                }
                headers = {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
                response = post(token_url, data=data, headers=headers)
                response = response.json()
                assert "access_token" in response, "Failed to get access token"
                access_token = response["access_token"]

                user_info = get(config["OAUTH"][service]["userinfo_url"], headers={
                    "Authorization": f"Bearer {access_token}"
                })

                email = user_info.json()["email"]
                display_name = user_info.json()["name"]
                password = self.random_string(32)

            exist_user = self._repo.find_one(
                query=QueryUserModel(email=email)
            )
            if exist_user is None:
                new_user = UserModel(
                    id=str(uuid4()),
                    slug=self.gen_slug(email),
                    email=email,
                    password=PasswordHandler.hash(password),
                    display_name=display_name
                )
                new_user = self._repo.create(new_user)
                assert new_user is not None, "Failed to create user"
            else:
                new_user = exist_user

            token = self._jwt.create({"uid": new_user.id})
            assert token is not None, "Failed to create token"
            return token
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail=str(e))

    @ staticmethod
    def gen_slug(display_name: str) -> str:
        return display_name.lower().replace(" ", "-") + "-" + "".join(choices(ascii_letters + digits, k=6))

    @ staticmethod
    def random_string(length: int) -> str:
        return "".join(choices(ascii_letters + digits, k=length))

    @ staticmethod
    def gen_cc(cm):
        cv = str(AuthService.random_string(32))
        cc = cm(cv)
        return cv, str(cc)
