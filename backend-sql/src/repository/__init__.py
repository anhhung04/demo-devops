import redis
from config import config
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi import HTTPException

engine = create_engine(config['DATABASE_URL'])
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

redis_pool: redis.ConnectionPool = redis.ConnectionPool(host=config["REDIS_HOST"], port=int(
    config["REDIS_PORT"]), max_connections=config["MAX_CONNECTIONS_REDIS"], db=0)


class Storage:
    @staticmethod
    def get():
        db = SessionLocal()
        try:
            yield db
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=str(e))
        finally:
            db.close()


class RedisStorage:
    @staticmethod
    def get():
        r = redis.Redis(connection_pool=redis_pool)
        try:
            yield r
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally:
            pass
