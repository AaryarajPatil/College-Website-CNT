# 🎓 Premium VIERP - Academic Dashboard & Student Portfolio System

A full-stack, enterprise-grade Student Academic Dashboard & Certified Portfolio Management System designed for engineering and computer science students. Built with a modern **React 19 + Vite** frontend and an **Express + MongoDB** backend with automatic zero-configuration **In-Memory MongoDB fallback**.

---

## ✨ Features

- 📊 **Executive Dashboard**: Real-time CGPA trend visualization with interactive 24K gold area charts (Chart.js), attendance metrics, semester credits, and project completion counters.
- 📚 **Courses & Academics**: Track course credits, attendance rates, professors, and syllabus milestone checklists.
- 💻 **Project Repositories**: Showcase software engineering projects with tech stack badges, GitHub/live demo links, and status tags.
- 📄 **Research & Publications**: Publication tracker supporting IEEE/ACM paper statuses, citations, DOIs, and co-author listings.
- 🏆 **Honors & Distinctions**: Record hackathons, scholarships, dean's list recognitions, and competitive awards.
- ⏰ **Deadlines & Schedule**: Priority-tagged deadline management with due date countdowns, status toggling, and subject associations.
- 📜 **Certified Student Portfolio**: Exportable and printable PDF resume modal showcasing academic credentials, rank, coursework, projects, and citations.
- 🔐 **Authentication & Security**: JWT-based authentication with bcrypt password hashing, session persistence, OTP recovery, and academic profile customization.
- ⚡ **Zero-Config Database**: Seamlessly connects to local MongoDB or automatically initializes an embedded in-memory MongoDB database with full realistic seed data.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Chart.js](https://www.chartjs.org/) + [react-chartjs-2](https://react-chartjs-2.js.org/)
- **Styling**: Glassmorphism UI with custom CSS variables & responsive layout
- **HTTP Client**: [Axios](https://axios-http.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express 4](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Embedded DB**: [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server) (automatic fallback)
- **Authentication**: [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Logging**: [Morgan](https://github.com/expressjs/morgan)

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** v18+ (tested on Node.js v20/v24)
- **npm** v9+

### 2. Installation

Clone the repository and install all root and sub-project dependencies:

```bash
# Clone repository
git clone https://github.com/AaryarajPatil/College-Website.git
cd "College Website"

# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
cd ..
```

### 3. Run the Entire Stack

From the root directory, start both the backend and frontend concurrently:

```bash
npm run dev
```

- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Health Endpoint**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Demo Account Credentials

The backend automatically seeds a realistic student profile on first launch:

| Field | Demo Credential |
|---|---|
| **Email** | `aryan.sharma@vierp.edu` |
| **Password** | `password123` |
| **Student** | Aryan Sharma (Final Year, CSE - AI & ML) |
| **Roll Number** | `21BCE10482` |

> 💡 *Click the **"Quick Fill Demo Account"** button on the login screen to sign in instantly.*

---

## 📂 Project Structure

```text
College Website/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection & seed data
│   │   ├── controllers/     # Route logic for auth, projects, research, etc.
│   │   ├── middleware/      # JWT auth guard & error handlers
│   │   ├── models/          # Mongoose Schemas (User, Subject, Project, etc.)
│   │   ├── routes/          # Express API route declarations
│   │   └── server.js        # Server bootstrap & entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/          # Static assets & icons
│   │   ├── components/      # Modular UI components
│   │   │   ├── auth/        # Login, Signup, OTP & Forgot Password
│   │   │   ├── common/      # Modals, Dialogs, Loaders
│   │   │   ├── dashboard/   # Executive Dashboard & Chart.js views
│   │   │   ├── layout/      # Top Navbar & Navigation Tabs
│   │   │   ├── portfolio/   # Certified Resume/Portfolio Modal
│   │   │   ├── profile/     # Profile Settings Modal
│   │   │   ├── projects/    # Project Repositories View
│   │   │   ├── research/    # Research Publications View
│   │   │   ├── subjects/    # Academic Courses View
│   │   │   └── timeline/    # Audit Log & Activity Stream
│   │   ├── context/         # Auth, Theme, and Toast Contexts
│   │   ├── services/        # Axios API client
│   │   ├── styles/          # Global theme and dashboard CSS
│   │   ├── App.jsx          # Root application component
│   │   └── main.jsx         # React DOM mount
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── package.json             # Root concurrency scripts
└── README.md
```

---

## 🌐 API Overview

| Route | Method | Description | Auth Required |
|---|---|---|---|
| `/api/health` | GET | Health & API status check | No |
| `/api/auth/login` | POST | Authenticate student | No |
| `/api/auth/signup` | POST | Register student account | No |
| `/api/auth/forgot-password` | POST | Request password reset code | No |
| `/api/auth/verify-otp` | POST | Verify 6-digit OTP code | No |
| `/api/auth/reset-password` | POST | Reset password with OTP | No |
| `/api/auth/me` | GET | Current student profile | Yes |
| `/api/auth/profile` | PUT | Update profile details | Yes |
| `/api/analytics/dashboard` | GET | Overall statistics & chart data | Yes |
| `/api/subjects` | GET/POST | Coursework management | Yes |
| `/api/projects` | GET/POST | Engineering project tracker | Yes |
| `/api/research` | GET/POST | Publications & research tracker | Yes |
| `/api/achievements` | GET/POST | Honors, awards, & certifications | Yes |
| `/api/deadlines` | GET/POST | Academic calendar deadlines | Yes |
| `/api/activities` | GET | Audit log & activity stream | Yes |

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).

