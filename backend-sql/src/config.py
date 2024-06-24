import os

config = {
    "PORT": 8000,
    "HOST": "0.0.0.0",
    "workers": 4,
    "PROD": os.getenv("PROD", False)
}