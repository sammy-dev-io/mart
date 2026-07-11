from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key = True, index = True)
    name = Column(String(255), nullable = False)
    description = Column(Text, nullable = True)
    price = Column(Float, nullable = False)
    original_price = Column(Float, nullable = True)
    category = Column(String(100), nullable = False)
    image = Column(String(500), nullable = True)
    stock = Column(String(20), nullable = False, default = "in")
    badge = Column(String(20), nullable = True)
    rating = Column(Float, nullable = False, default = 0.0)
    is_active = Column(Boolean, default = True)
    created_at = Column(DateTime(timezone = True), server_default = func.now())
    updated_at = Column(DateTime(timezone = True), onupdate = func.now())