# 🚀 Premium VIERP - Project Walkthrough & Execution Guide

This document outlines how to run the application, the verified server status, the end-to-end user workflow, and the fixes and improvements applied to the codebase.

---

## 📌 1. Verified Live Services

Both services have been tested and verified to start and communicate cleanly:

| Service | Port / URL | Status | Health Verification |
|---|---|---|---|
| **Backend API** | `http://localhost:5000` | 🟢 Online | `GET /api/health` -> `200 OK` |
| **Frontend App** | `http://localhost:3000` | 🟢 Online | `GET /` -> `200 OK` |
| **Database** | Embedded In-Memory / Local MongoDB | 🟢 Seeded | Pre-seeded with 6 subjects, 5 projects, 4 research papers, 6 achievements, 5 deadlines |

---

## 💻 2. How to Run the Application

From the project root directory (`College Website`):

```bash
npm run dev
```

This single command triggers `concurrently` to run both:
- `backend`: starts Express on port `5000`
- `frontend`: starts Vite dev server on port `3000` with proxy `/api` -> `http://localhost:5000`

### Individual service commands (if needed)
```bash
# Backend only
cd backend
npm start

# Frontend only
cd frontend
npm run dev
```

---

## 🔑 3. Authentication & Demo Account

The system is pre-loaded with a student record:

- **Email**: `aryan.sharma@vierp.edu`
- **Password**: `password123`
- **Name**: Aryan Sharma
- **Degree**: B.Tech Computer Science & Engineering (AI & ML), Semester 7, CGPA 9.34

> **Tip**: On the login screen, click **"⚡ Quick Fill Demo Account"** to automatically populate credentials and sign in with one click.

---

## 🛠️ 4. Changes & Enhancements Made

### 1. Fixed Authentication Context (`frontend/src/context/AuthContext.jsx`)
- **Problem**: `AuthView.jsx` was attempting to call `register`, `forgotPassword`, `verifyEmailOtp`, and `resetPassword`, but these methods were not exposed by `AuthContext`. Attempting to register or reset a password threw unhandled `TypeError` exceptions.
- **Fix**: Added implementations for `forgotPassword`, `verifyEmailOtp`, `resetPassword`, and exported `register` as an alias to `signup`.

### 2. Streamlined Registration Experience (`frontend/src/components/auth/AuthView.jsx`)
- **Problem**: `handleSignupSubmit` was checking for an unused `res.user?.isEmailVerified` field, triggering a non-functional OTP verification screen even though the backend immediately logs the user in upon signup.
- **Fix**: Updated signup submission to authenticate immediately and transition cleanly to the academic dashboard. Also connected the demo OTP preview in the password reset flow.

### 3. Graceful Shutdown & Database Teardown (`backend/src/server.js`)
- Added `SIGINT` and `SIGTERM` handlers to cleanly close Mongoose connections and Express server instances to prevent orphaned port locks on Windows.

### 4. Environment Configuration (`backend/.env` & `backend/.env.example`)
- Created standardized `.env` and `.env.example` files specifying `PORT=5000`, `MONGODB_URI`, `JWT_SECRET`, and `NODE_ENV`.

### 5. Restored Documentation (`README.md`)
- Recovered and overhauled `README.md` from a merge conflict state to provide full documentation of features, stack, architecture, API endpoints, and setup.

---

## 🧪 5. Testing the Application Features

1. **Open the App**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.
2. **Sign In**:
   Click **"Quick Fill Demo Account"** and hit **"Enter Workspace"**.
3. **Explore Dashboard**:
   - Inspect the interactive CGPA Trend Area Chart (Chart.js).
   - Review Course attendance rates and syllabus checkboxes.
   - Filter Software Engineering projects by status (`All`, `Completed`, `In Progress`).
4. **Quick Actions (+ Menu)**:
   - Click the **"+"** button on the navbar to add a new Course, Project, Research Paper, Achievement, or Deadline.
5. **Certified Resume / Portfolio**:
   - Click **"Export Portfolio"** in the navigation bar to preview the student resume.
   - Click **"Export PDF / Print"** to trigger a clean printable layout.
6. **Student Settings**:
   - Click the user avatar in the top right to open **Student Academic Profile Settings** and update profile details or social links.

