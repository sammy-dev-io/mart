from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate, OrderStatusUpdate, OrderResponse
from app.utils.auth import get_current_user, get_admin_user

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)

# POST place a new order — logged in users only
@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def place_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if not order_data.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must contain at least one item"
        )

    total = 0
    order_items = []

    for item in order_data.items:
        product = db.query(Product).filter(
            Product.id == item.product_id,
            Product.is_active == True
        ).first()

        if not product:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product with id {item.product_id} not found"
            )

        if product.stock == "out":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"{product.name} is out of stock"
            )

        item_total = product.price * item.quantity
        total += item_total

        order_items.append(OrderItem(
            product_id=product.id,
            quantity=item.quantity,
            price=product.price
        ))

    new_order = Order(
        user_id=current_user.id,
        total=total,
        address=order_data.address,
        phone=order_data.phone,
        note=order_data.note
    )

    db.add(new_order)
    db.flush()

    for item in order_items:
        item.order_id = new_order.id
        db.add(item)

    db.commit()
    db.refresh(new_order)
    return new_order


# GET my orders — logged in users only
@router.get("/my-orders", response_model=List[OrderResponse])
def get_my_orders(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    orders = db.query(Order).filter(
        Order.user_id == current_user.id
    ).order_by(Order.created_at.desc()).all()
    return orders


# GET all orders — admin only
@router.get("/", response_model=List[OrderResponse])
def get_all_orders(
    db: Session = Depends(get_db),
    current_user = Depends(get_admin_user)
):
    orders = db.query(Order).order_by(Order.created_at.desc()).all()
    return orders


# GET single order — logged in users only
@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    if order.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view your own orders"
        )

    return order


# PUT update order status — admin only
@router.put("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    status_update: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_admin_user)
):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )

    valid_statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"]
    if status_update.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )

    order.status = status_update.status
    db.commit()
    db.refresh(order)
    return order