# ⏱️ Attendance & Timesheet Management System

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Hono](https://img.shields.io/badge/Hono.js-E36002?style=for-the-badge&logo=hono&logoColor=white)](https://hono.dev/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A modern, high-performance **Full-Stack Attendance & Timesheet Management System** built with end-to-end type safety, modern UI components, and granular **Role-Based Access Control (RBAC)**. Designed for enterprise workforce optimization, seamless time tracking, and manager approval workflows.

---

## 🚀 Key Features

* **🛡️ Multi-Tier Role-Based Access Control (RBAC)**
  * **Employee Portal**: Clock in/out, log daily project hours, view personal timesheets, and track attendance history.
  * **Manager Dashboard**: Review employee daily timesheets, approve or reject log submissions, and monitor team availability.
  * **Admin Panel**: Manage user accounts, assign user roles, conduct workforce audits, and analyze company-wide attendance patterns.

* **⚡ Real-Time Attendance & Time Logs**
  * Automated work duration calculation with precise timestamp tracking.
  * Interactive activity logs for continuous productivity monitoring.

* **🎨 Modern & Responsive User Interface**
  * Built with **React 19**, **Tailwind CSS v4**, and smooth animations powered by **Framer Motion**.
  * Accessible dashboard design featuring clean data visualizations.

* **🔒 Enterprise Security & Authentication**
  * Secure user authentication leveraging **JWT (JSON Web Tokens)**.
  * Salted password hashing with **bcryptjs**.
  * Protected API routes with middleware-level authorization checks.

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
* **Framework**: React 19 + Vite (TypeScript)
* **Styling**: Tailwind CSS v4 + Framer Motion
* **Routing & HTTP**: React Router v7 + Axios
* **Icons**: Lucide React

### **Backend**
* **Runtime / Framework**: Node.js + Hono Framework
* **Database & ORM**: SQLite (`better-sqlite3`) + Drizzle ORM
* **Migrations**: Drizzle Kit
* **Security & Auth**: JWT Authentication + `bcryptjs`
* **Development**: `tsx` execution environment

---

## 📁 Project Architecture

```text
Attendance_Timesheet Management System/
├── backend/                  # Hono REST API & Database Layer
│   ├── src/
│   │   ├── controllers/      # Request handlers & business logic
│   │   ├── db/               # Drizzle database schemas & connection setup
│   │   ├── middleware/       # JWT Authentication & RBAC middleware
│   │   ├── routes/           # Endpoint definitions (Auth, Attendance, Manager, Admin)
│   │   └── index.ts          # Server entry point
├── drizzle/                  # Auto-generated SQL migration files
├── frontend/                 # React 19 SPA Frontend
│   ├── src/
│   │   ├── api/              # Axios API client instances & endpoints
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # React Context (Auth State)
│   │   ├── pages/            # Views (Login, Dashboard, Manager, Admin)
│   │   └── App.tsx           # Client router & app wrapper
│   ├── package.json
│   └── vite.config.ts
├── drizzle.config.ts         # Drizzle ORM configuration
└── package.json              # Monorepo/Backend configuration
```

---

## 💻 Getting Started

### **Prerequisites**
* **Node.js** (v18.0.0 or higher)
* **npm** or **pnpm**

---

### **1. Installation**

Clone the repository and install dependencies for both root (backend) and frontend:

```bash
# Clone the repository
git clone https://github.com/Anshika-03/Attendance-Timesheet-Management-System.git

# Navigate into the project folder
cd "Attendance-Timesheet-Management-System"

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

---

### **2. Database Setup & Migrations**

Generate and apply database migrations using **Drizzle ORM**:

```bash
# Generate SQL migrations
npm run generate

# Apply migrations to SQLite database
npm run migrate
```

---

### **3. Environment Setup**

Create a `.env` file in the root directory:

```env
PORT=3000
JWT_SECRET=your_super_secret_jwt_key
DATABASE_URL=attendance.db
```

---

### **4. Running the Application**

Start both the backend server and frontend development client:

**Backend (Hono REST Server):**
```bash
# From root directory
npm run dev
# Server will run at http://localhost:3000
```

**Frontend (Vite Dev Server):**
```bash
# Open a new terminal tab/window
cd frontend
npm run dev
# App will run at http://localhost:5173
```
