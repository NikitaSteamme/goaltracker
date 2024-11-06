from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    result = Column(String)
    duration = Column(Integer)
    finish_time = Column(String)
    finish_criteria = Column(String)
    resources = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("User")