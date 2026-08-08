import requests
import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models.order import Order
from app.utils.auth import get_current_user

router = APIRouter(
    prefix="/payments",
    tags=["Payments"]
)

PAYSTACK_SECRET_KEY = os.getenv("PAYSTACK_SECRET_KEY")

class InitializePayment(BaseModel):
    order_id: int
    email: str

class VerifyPayment(BaseModel):
    reference: str
    order_id: int

@router.post("/initialize")
def initialize_payment(
    data: InitializePayment,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    order = db.query(Order).filter(Order.id == data.order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    if order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only pay for your own orders"
        )

    if order.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This order has already been paid or cancelled"
        )

    amount_in_kobo = int(order.total * 100)

    headers = {
        "Authorization": f"Bearer {PAYSTACK_SECRET_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "email": data.email,
        "amount": amount_in_kobo,
        "reference": f"MART-{order.id}-{uuid.uuid4().hex[:10]}",
        "callback_url": "http://localhost:5173/payment/callback",
        "metadata": {
            "order_id": order.id,
            "user_id": current_user.id
        }
    }

    response = requests.post(
        "https://api.paystack.co/transaction/initialize",
        json=payload,
        headers=headers
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to initialize payment"
        )

    return response.json()


@router.post("/verify")
def verify_payment(
    data: VerifyPayment,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    order = db.query(Order).filter(Order.id == data.order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    if order.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only verify your own orders"
        )

    headers = {
        "Authorization": f"Bearer {PAYSTACK_SECRET_KEY}",
    }

    response = requests.get(
        f"https://api.paystack.co/transaction/verify/{data.reference}",
        headers=headers
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to verify payment"
        )

    result = response.json()

    if result["data"]["status"] != "success":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment was not successful"
        )

    paid_amount = result["data"]["amount"] / 100
    if paid_amount != order.total:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment amount does not match order total"
        )

    order.status = "confirmed"
    db.commit()
    db.refresh(order)

    return {
        "message": "Payment verified successfully",
        "order_id": order.id,
        "status": order.status,
        "amount_paid": paid_amount
    }