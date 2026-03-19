# 🚀 EzHire — Scalable Job Portal with Microservices

EzHire is a **microservices-based job portal** designed to simulate a real-world hiring platform with modular backend services and event-driven communication.

---

## 📌 What This Project Demonstrates

- Microservices architecture (Auth, User, Job, Payment)
- Kafka-based event-driven communication (practical use-case)
- Full-stack system using Next.js + Node.js
- Real-world flows like:
  - Password reset
  - Job application tracking
  - Subscription payments

---

## ✨ Features

### 👤 User
- Register / Login
- Profile (skills, experience, bio)
- Apply to jobs
- Track application status
- AI Resume Analyzer
- AI Career Guidance

### 🧑‍💼 Recruiter
- Post jobs
- Manage applicants
- Update job status

### 🔐 Authentication
- JWT-based authentication
- Forgot Password / Reset Password flow

### 💳 Payments
- Razorpay subscription integration

### 📩 Notifications (Kafka)
- Password reset emails
- Job status updates

---

## 🧰 Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- TypeScript

### Infrastructure
- PostgreSQL
- Redis
- Apache Kafka

---

## 🏗️ Architecture Overview

- Each service runs independently  
- Kafka is used for **event-based communication (notifications only)**  
- REST APIs used for core business logic  

### Services:
- Auth Service
- User Service
- Job Service
- Payment Service
- Kafka Utility (Consumer)

---

## 🔄 Kafka Usage (Important)

Kafka is **not used everywhere**, only for:

- Password reset email triggering  
- Job status update notifications  

This keeps services loosely coupled and avoids blocking API calls.

---

## 📁 Project Structure

```
frontend/
services/
  ├── auth/
  ├── user/
  ├── job/
  ├── payment/
  └── utils/
```

---

## ⚙️ Prerequisites

- Node.js (v18+)
- PostgreSQL
- Redis
- Apache Kafka
- npm / yarn

---

## 🚀 Setup & Run

### 1. Clone Repository

```bash
git clone https://github.com/Prashantbhati7/EzHire.git
cd ezhire
```

---

### 2. Install Dependencies

#### Frontend

```bash
cd frontend
npm install
```

#### Backend (run in each service)

```bash
npm install
```

---

### 3. Setup Environment Variables

Each service requires:

- PostgreSQL connection URL  
- Kafka broker URL  
- Redis URL  
- JWT Secret  
- Razorpay keys (payment service)  

---

### 4. Start Infrastructure

Ensure these are running:

- PostgreSQL  
- Redis  
- Kafka + Zookeeper  

---

### 5. Run Services

Start each service:

```bash
npm run dev
```

---

### 6. Run Frontend

```bash
cd frontend
npm run dev
```

---

### 7. Open App

```
http://localhost:3000
```

---

## ⚠️ Notes

- All services must run simultaneously  
- Kafka must be configured correctly  
- Missing env variables will break services  

---

## 👤 Author

**Prashant Bhati**
