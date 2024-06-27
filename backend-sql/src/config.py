import os
from dotenv import load_dotenv

load_dotenv()

config = {
    "PORT": 8000,
    "HOST": "0.0.0.0",
    "workers": 4,
    "PROD": os.getenv("PROD", False),
    # "DATABASE_URL": os.getenv("DATABASE_URL", "sqlite:///./dev.db"),
    "DATABASE_URL": os.getenv("DATABASE_URL", "postgresql+psycopg2://dev_user:secret@localhost:5432/dev_demo_devops"),
    "REDIS_HOST": os.getenv("REDIS_HOST", "localhost"),
    "REDIS_PORT": os.getenv("REDIS_PORT", 6379),
    "MAX_CONNECTIONS_REDIS": os.getenv("MAX_CONNECTIONS_REDIS", 10),
    "JWT_EXPIRATION": os.getenv("JWT_EXPIRATION", 3600 * 24),
    "PASSWORD_SALT": os.getenv("PASSWORD_SALT", "salt"),
    "ALLOWED_HOSTS": ["http://localhost:3000"],
    "OAUTH": {
        "google": {
            "client_id": os.getenv("GOOGLE_CLIENT_ID", ""),
            "client_secret": os.getenv("GOOGLE_CLIENT_SECRET", ""),
            "redirect_uri": os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:3000/oauth/cb"),
            "auth_url": "https://accounts.google.com/o/oauth2/auth",
            "token_url": "https://oauth2.googleapis.com/token",
            "userinfo_url": "https://www.googleapis.com/oauth2/v1/userinfo",
            "scope": ["email", "profile"]
        }
    }
}