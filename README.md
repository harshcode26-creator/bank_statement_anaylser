# 🏦 Bank Statement Analyzer

A full-stack web application that analyzes bank statements and provides smart financial insights using AI-powered categorization.

---

## 🚀 Live Features

* 📄 Upload bank statements (PDF)(CSV)
* 🧠 Automatic transaction categorization (AI-assisted)
* 📊 Category-wise spending breakdown
* 📅 Monthly income vs expense tracking
* 🧾 Detailed transaction history
* 🕒 Saved history of uploads (persistent via database)
* 🔐 User authentication (JWT-based)
* 📈 Smart dashboard with insights & analytics

---

## 🧠 Key Highlights

* AI fallback system for stable categorization
* Clean category structure (no noisy categories)
* MongoDB-powered history (data persists after refresh)
* Optimized API design with batch processing
* Fully responsive modern UI (desktop + mobile)

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* React Router DOM
* Axios

### Backend

* Node.js
* Express.js
* MongoDB (Atlas)
* Mongoose
* JWT Authentication
* bcryptjs

### AI / Processing

* LLM-based categorization (with fallback models)
* Rule-based fallback system

---

## 📁 Project Structure

```
/frontend
  /src
    /pages
    /components
    /services
    App.jsx

/backend
  /controllers
  /models
  /routes
  /services
  server.js
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```
git clone https://github.com/harshcode26-creator/bank_statement_anaylser.git
cd bank-statement-analyzer
```

---

### 2. Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend:

```
npm run dev
```

---

### 3. Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 🔐 Authentication Flow

* User Signup/Login via JWT
* Token stored in localStorage
* Protected routes for dashboard
* Backend verifies token using middleware

---

## 🗄️ Database Design

### Collections:

#### Users

* name
* email
* password (hashed)

#### Uploads

* title
* summary (income, expense, net)
* categories
* monthly data
* createdAt

#### Transactions

* uploadId (ref)
* date
* description
* amount
* type (credit/debit)
* category

---

## 📊 Dashboard Features

* Income vs Expense chart
* Category breakdown with percentages
* Recent transactions
* Top merchants (based on spending)
* Smart insights (auto-generated)

---

## ⚡ Performance Optimizations

* Batch AI categorization
* Fallback model handling
* Filter-only "Other" transactions for AI
* Reduced unnecessary API calls

---

## 📌 Future Improvements

* Google OAuth (Clerk/Auth integration)
* PDF parsing support
* Export reports (PDF/CSV)
* Advanced analytics (trends, predictions)
* Multi-user dashboard enhancements

---

## 🧪 Known Limitations

* Currently optimized for CSV files
* AI categorization depends on model availability
* No real-time processing (async batch)

---

## 👨‍💻 Author

Harsh
BCA Final Year Student | MERN Developer

---

## ⭐ If you like this project

Give it a star ⭐ and share it!
