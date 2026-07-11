# Mart

A full-stack e-commerce web application built for learning purposes.

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Python (FastAPI)
- **Database:** PostgreSQL
- **Payment:** Paystack (coming later)

## Project Structure

    mart/
    ├── backend/
    │   ├── app/
    │   │   ├── models/
    │   │   ├── routes/
    │   │   ├── schemas/
    │   │   ├── main.py
    │   │   └── database.py
    │   ├── venv/
    │   ├── .env
    │   └── requirements.txt
    ├── frontend/
    └── README.md

## Getting Started

### Prerequisites

- Node.js v20+
- Python 3.10+
- PostgreSQL

### Backend Setup

Step 1 - Navigate to backend folder:

    cd backend

Step 2 - Create and activate virtual environment:

    python -m venv venv
    venv\Scripts\activate

Step 3 - Install dependencies:

    pip install -r requirements.txt

Step 4 - Create a .env file in the backend folder and add:

    DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/mart
    SECRET_KEY=supersecretkey

Step 5 - Run the backend server:

    uvicorn app.main:app --reload

Backend runs on: http://localhost:8000

API Documentation: http://localhost:8000/docs

### Frontend Setup

Coming in the next step.

## Features Roadmap

- [ ] Products API
- [ ] Admin Dashboard
- [ ] User Authentication
- [ ] Orders
- [ ] Paystack Payment
- [ ] Mobile App (Capacitor)

## Important Notes

- Never push .env to GitHub
- Never push venv to GitHub
- Always activate venv before running any pip command