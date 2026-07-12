from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ProductBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    original_price: Optional[float] = Field(None, gt=0)
    category: str = Field (..., min_length=1, max_length=100)
    image: Optional[str] = None
    stock: str = Field(default="in")
    badge: Optional[str] = None
    rating: float = Field(default=0.0, ge=0.0, le=5.0)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    original_price: Optional[float] = Field(None, gt=0)
    category: Optional[str] = Field(None, min_length=1, max_length=100)
    image: Optional[str] = None 
    stock: Optional[str] = None 
    badge: Optional[str] = None 
    rating: Optional[float] = Field(None, ge=0.0, le=5.0) 
    is_active: Optional[bool] = None

class ProductResponse(ProductBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True