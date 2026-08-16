from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserRegister, UserLogin, UserResponse, Token
from app.utils.auth import get_admin_user, hash_password, verify_password, create_access_token
from fastapi.security import OAuth2PasswordRequestForm
from app.utils.auth import get_current_user
import secrets
from app.utils.email import send_verification_email

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    hashed = hash_password(user_data.password)
    token = secrets.token_urlsafe(32)

    new_user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        password=hashed,
        verification_token=token,
        is_verified=False
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    send_verification_email(new_user.email, new_user.full_name, token)

    return new_user


@router.post("/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    # Find the user by email
    user = db.query(User).filter(User.email == user_data.email).first()

    # Check user exists and password is correct
    if not user or not verify_password(user_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # Check account is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account has been deactivated"
        )

    # Create and return the token
    access_token = create_access_token(data={
        "id": user.id,
        "is_admin": user.is_admin
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# Form-based login — for docs page testing only
@router.post("/token", response_model=Token)
def login_for_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account has been deactivated"
        )
    access_token = create_access_token(data={
        "id": user.id,
        "is_admin": user.is_admin
    })
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/users", response_model=list[UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    current_user = Depends(get_admin_user)
):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return users

# GET current logged in user
@router.get("/me", response_model=UserResponse)
def get_me(current_user = Depends(get_current_user)):
    return current_user

@router.put("/users/{user_id}/status")
def toggle_user_status(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_admin_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    if user.id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot deactivate your own admin account")
    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)
    return {"id": user.id, "is_active": user.is_active}


@router.put("/deactivate")
def deactivate_own_account(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    current_user.is_active = False
    db.commit()
    return {"message": "Your account has been deactivated"}