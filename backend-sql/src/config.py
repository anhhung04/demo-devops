import os

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
    "PASSWORD_SALT": os.getenv("PASSWORD_SALT", "salt")
}