from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import time

# Use pymysql driver
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@db/taskdb")

# Simple retry logic for waiting for DB
engine = None
for i in range(10):
    try:
        engine = create_engine(SQLALCHEMY_DATABASE_URL)
        with engine.connect() as connection:
            print("Database connected!")
            break
    except Exception as e:
        print(f"Database not ready, retrying... ({i+1}/10)")
        time.sleep(3)

if not engine:
    raise Exception("Could not connect to database")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
