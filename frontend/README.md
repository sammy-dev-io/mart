# Mart

A full-stack e-commerce marketplace built for learning purposes. Customers can browse products across multiple categories, add to cart, checkout, and pay securely via Paystack. Admins manage products, orders, and customers from a dedicated dashboard.

## Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Python (FastAPI)
- **Database:** PostgreSQL
- **Payment:** Paystack (hosted checkout)
- **Authentication:** JWT tokens with bcrypt password hashing

## Live Demo

- Frontend: _(added after deployment)_
- Backend API Docs: _(added after deployment)_

## Project Structure

    mart/
    ├── backend/
    │   ├── app/
    │   │   ├── models/          # product.py, user.py, order.py
    │   │   ├── routes/          # product.py, auth.py, order.py, payment.py
    │   │   ├── schemas/         # product.py, user.py, order.py
    │   │   ├── utils/           # auth.py
    │   │   ├── database.py
    │   │   └── main.py
    │   ├── venv/
    │   ├── .env
    │   └── requirements.txt
    ├── frontend/
    │   ├── src/
    │   │   ├── api/axios.js
    │   │   ├── components/      # Navbar, Footer, AppSidebar, ProtectedRoute
    │   │   ├── context/CartContext.jsx
    │   │   ├── pages/
    │   │   │   ├── account/     # Profile, Settings, AccountLayout
    │   │   │   ├── admin/       # Dashboard, ProductList, ProductForm, AdminOrders, AdminCustomers
    │   │   │   ├── Home, Login, Register, Products, ProductDetail
    │   │   │   ├── Cart, Checkout, Orders, Payment, PaymentCallback
    │   │   │   ├── About, Contact, NotFound
    │   │   ├── App.jsx, main.jsx, index.css
    │   ├── .env
    │   └── package.json
    └── README.md

## Features

### Customer
- Browse products by category, search, price range, stock status
- Product detail pages with related products
- Cart with per-user persistence (isolated by user id)
- Checkout with delivery details
- Paystack payment (hosted checkout)
- Order history with real-time status tracking
- Pay-later support for pending orders
- Personal account dashboard (overview, orders, settings)
- Self-service account deactivation

### Admin
- Sidebar dashboard with revenue, order, and product stats
- Full product CRUD (create, edit, deactivate)
- Order management with status updates
- Customer list with activate/deactivate controls

## Getting Started

### Prerequisites
- Node.js v20+
- Python 3.10+
- PostgreSQL
- Paystack account (test keys)

### Backend Setup

    cd backend
    python -m venv venv
    venv\Scripts\activate
    pip install -r requirements.txt

Create `backend/.env`:

    DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/mart
    SECRET_KEY=your_secret_key_here
    PAYSTACK_SECRET_KEY=sk_test_your_key_here
    PAYSTACK_PUBLIC_KEY=pk_test_your_key_here

Run the server:

    uvicorn app.main:app --reload

Backend: http://localhost:8000
Docs: http://localhost:8000/docs

### Frontend Setup

    cd frontend
    npm install

Create `frontend/.env`:

    VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_key_here

Run the frontend:

    npm run dev

Frontend: http://localhost:5173

## API Endpoints

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /auth/users` (admin)
- `PUT /auth/users/{id}/status` (admin)
- `PUT /auth/deactivate` (self)

### Products
- `GET /products/`
- `GET /products/{id}`
- `GET /products/admin/all` (admin)
- `POST /products/` (admin)
- `PUT /products/{id}` (admin)
- `DELETE /products/{id}` (admin, soft delete)

### Orders
- `POST /orders/`
- `GET /orders/my-orders`
- `GET /orders/{id}`
- `GET /orders/` (admin)
- `PUT /orders/{id}/status` (admin)

### Payments
- `POST /payments/initialize`
- `POST /payments/verify`

## Notes

- Never commit `.env` files
- Test card: `4084 0840 8408 4081`, CVV `408`, PIN `0000`, OTP `123456`
- To promote a user to admin:
  `UPDATE users SET is_admin = true WHERE email = 'email@example.com';`