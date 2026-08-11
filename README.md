# Mart

A full-stack e-commerce web application built for learning purposes.

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Python (FastAPI)
- **Database:** PostgreSQL
- **Payment:** Paystack
- **Authentication:** JWT tokens with bcrypt password hashing

## Project Structure

    mart/
    ├── backend/
    │   ├── app/
    │   │   ├── models/
    │   │   │   ├── product.py
    │   │   │   ├── user.py
    │   │   │   └── order.py
    │   │   ├── routes/
    │   │   │   ├── product.py
    │   │   │   ├── auth.py
    │   │   │   ├── order.py
    │   │   │   └── payment.py
    │   │   ├── schemas/
    │   │   │   ├── product.py
    │   │   │   ├── user.py
    │   │   │   └── order.py
    │   │   ├── utils/
    │   │   │   └── auth.py
    │   │   ├── database.py
    │   │   └── main.py
    │   ├── venv/
    │   ├── .env
    │   └── requirements.txt
    ├── frontend/
    │   ├── src/
    │   │   ├── api/
    │   │   │   └── axios.js
    │   │   ├── components/
    │   │   │   └── ProtectedRoute.jsx
    │   │   ├── context/
    │   │   │   └── CartContext.jsx
    │   │   ├── pages/
    │   │   │   ├── admin/
    │   │   │   │   ├── Dashboard.jsx
    │   │   │   │   ├── ProductList.jsx
    │   │   │   │   └── ProductForm.jsx
    │   │   │   ├── Home.jsx
    │   │   │   ├── Login.jsx
    │   │   │   ├── Cart.jsx
    │   │   │   ├── Checkout.jsx
    │   │   │   ├── Orders.jsx
    │   │   │   ├── Payment.jsx
    │   │   │   └── PaymentCallback.jsx
    │   │   ├── App.jsx
    │   │   └── main.jsx
    │   ├── .env
    │   └── package.json
    └── README.md

## Features Completed

- [x] Products API — create, read, update, delete
- [x] Admin Dashboard — manage products
- [x] User Authentication — register, login, JWT tokens
- [x] Protected Routes — frontend and backend
- [x] Cart — persistent with localStorage
- [x] Orders — place, view, track
- [x] Paystack Payment — hosted checkout with verification

## Features Roadmap

- [ ] Customer-facing product listing page
- [ ] Product search and filtering
- [ ] Deploy backend to Railway or Render
- [ ] Deploy frontend to Vercel
- [ ] Mobile app with Capacitor

## Getting Started

### Prerequisites

- Node.js v20+
- Python 3.10+
- PostgreSQL
- Paystack account

### Backend Setup

Step 1 - Navigate to backend folder:

    cd backend

Step 2 - Create and activate virtual environment:

    python -m venv venv
    venv\Scripts\activate

Step 3 - Install dependencies:

    pip install -r requirements.txt

Step 4 - Create a .env file in the backend folder:

    DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/mart
    SECRET_KEY=your_secret_key_here
    PAYSTACK_SECRET_KEY=sk_test_your_key_here
    PAYSTACK_PUBLIC_KEY=pk_test_your_key_here

Step 5 - Run the backend server:

    uvicorn app.main:app --reload

Backend runs on: http://localhost:8000
API Documentation: http://localhost:8000/docs

### Frontend Setup

Step 1 - Navigate to frontend folder:

    cd frontend

Step 2 - Install dependencies:

    npm install

Step 3 - Create a .env file in the frontend folder:

    VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_key_here

Step 4 - Run the frontend:

    npm run dev

Frontend runs on: http://localhost:5173

## API Endpoints

### Authentication
- POST /auth/register — create account
- POST /auth/login — login and get token
- GET /auth/me — get current user

### Products
- GET /products/ — get all active products
- GET /products/{id} — get single product
- GET /products/admin/all — get all products including inactive (admin only)
- POST /products/ — create product (admin only)
- PUT /products/{id} — update product (admin only)
- DELETE /products/{id} — deactivate product (admin only)

### Orders
- POST /orders/ — place order (logged in users)
- GET /orders/my-orders — get my orders (logged in users)
- GET /orders/{id} — get single order (logged in users)
- GET /orders/ — get all orders (admin only)
- PUT /orders/{id}/status — update order status (admin only)

### Payments
- POST /payments/initialize — initialize Paystack payment
- POST /payments/verify — verify payment after completion

## Important Notes

- Never push .env files to GitHub
- Never push venv or node_modules to GitHub
- Always activate venv before running pip commands
- Paystack test card: 4084 0840 8408 4081, CVV: 408, PIN: 0000, OTP: 123456
- To make a user admin: UPDATE users SET is_admin = true WHERE email = 'email@example.com';