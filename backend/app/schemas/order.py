from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0)

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float

    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    address: str = Field(..., min_length=5)
    phone: str = Field(..., min_length=5)
    note: Optional[str] = None
    items: List[OrderItemCreate]

class OrderStatusUpdate(BaseModel):
    status: str

class OrderResponse(BaseModel):
    id: int
    user_id: int
    total: float
    status: str
    address: str
    phone: str
    note: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True