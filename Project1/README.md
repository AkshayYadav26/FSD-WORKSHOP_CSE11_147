# Student Management System

A B.Tech mini project built with **React** (frontend) and **Node.js + Express** (backend).
Student records are stored in an **in-memory JavaScript array** — no database is used, so all
data resets when the backend server restarts.

---

## 📖 Project Description

This application lets a user manage student records through a clean dashboard interface:

- Add a new student with validation
- View all students in a table
- Search students by **ID** or **Name** (name search is case-insensitive)
- Update an existing student
- Delete a student (with confirmation)

The React frontend talks to the Express backend through REST APIs (`fetch`), and the backend
responds with proper HTTP status codes (`200`, `201`, `400`, `404`, `409`) and JSON.

## ✨ Features

| Feature | Details |
|---|---|
| Add Student | Student ID, Name, Email, Branch, Semester, Mobile |
| Validation | Unique positive ID, required name, valid email format, branch ∈ {CSE, CS, IT, ECE}, semester 1–8, exactly 10-digit mobile |
| Display Students | Table with all fields + Edit/Delete actions |
| Update Student | Edit loads the record into the form (ID locked), list refreshes automatically |
| Delete Student | Confirmation dialog before deleting |
| Search | By Student ID or Name, case-insensitive, shows "No student found" when nothing matches |
| UI States | Loading state, empty state, success/error notifications, responsive layout |

## 🛠 Technologies Used

- **Frontend:** React 19 (functional components, `useState`, `useEffect`), Vite, CSS, Fetch API
- **Backend:** Node.js, Express.js, CORS, `express.json()`
- **Storage:** In-memory JavaScript array (no database)

## 📁 Project Structure

```
Project1/
├── backend/
│   ├── server.js               # Express app: CORS, JSON middleware, starts the server
│   ├── package.json
│   └── routes/
│       └── studentRoutes.js    # In-memory array + validation + all 5 REST endpoints
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx            # Entry point
        ├── App.jsx             # State management + all API calls (CRUD)
        ├── App.css             # All styling
        ├── index.css           # Base styles
        └── components/
            ├── StudentForm.jsx     # Add/Update form with client-side validation
            ├── StudentList.jsx     # Table + loading/empty/no-result states
            └── SearchStudent.jsx   # Search bar
```

## ⚙️ Installation

Requirements: **Node.js 18+** and npm.

```bash
# 1. Backend dependencies
cd backend
npm install

# 2. Frontend dependencies (open a new terminal)
cd frontend
npm install
```

## ▶️ How to Run

**Terminal 1 — Backend** (runs at `http://localhost:5000`):

```bash
cd backend
npm start
# or, for auto-restart on file changes:
npm run dev
```

**Terminal 2 — Frontend** (runs at `http://localhost:5173`):

```bash
cd frontend
npm run dev
```

Then open **http://localhost:5173** in your browser.

> Note: the frontend calls the API at `http://localhost:5000/api/students`
> (see `API_URL` at the top of `frontend/src/App.jsx`). If you change the backend
> port, update that constant too.

## 🔌 API Endpoints

Base URL: `http://localhost:5000/api/students`

| Method | Endpoint | Description | Success Status |
|---|---|---|---|
| GET | `/api/students` | Get all students | 200 |
| GET | `/api/students/:id` | Get one student | 200 |
| POST | `/api/students` | Add a new student | 201 |
| PUT | `/api/students/:id` | Update a student | 200 |
| DELETE | `/api/students/:id` | Delete a student | 200 |

Error codes: `400` validation failed, `404` student not found, `409` duplicate student ID.

## 📮 Example API Request

**Add a student** (POST `http://localhost:5000/api/students`):

```json
{
  "id": 101,
  "name": "Rahul Sharma",
  "email": "rahul@gmail.com",
  "branch": "CSE",
  "semester": 3,
  "mobile": "9876543210"
}
```

Success response (`201 Created`):

```json
{
  "success": true,
  "message": "Student added successfully.",
  "data": {
    "id": 101,
    "name": "Rahul Sharma",
    "email": "rahul@gmail.com",
    "branch": "CSE",
    "semester": 3,
    "mobile": "9876543210"
  }
}
```

Duplicate ID response (`409 Conflict`):

```json
{
  "success": false,
  "message": "Student ID 101 already exists. Please use a unique ID."
}
```

## 🧪 Quick API Test (optional)

With the backend running:

```bash
curl http://localhost:5000/api/students
curl -X POST http://localhost:5000/api/students -H "Content-Type: application/json" -d "{\"id\":201,\"name\":\"Test\",\"email\":\"test@gmail.com\",\"branch\":\"IT\",\"semester\":2,\"mobile\":\"9999999999\"}"
```

## 📸 Screenshots

_Add screenshots here after running the app:_

1. Dashboard with form, search bar and student table
2. Success notification after adding a student
3. Validation error messages
4. Empty state ("No students yet")
5. Search results / "No student found"

## ⚠️ Important: In-Memory Storage

Students are kept in a plain JavaScript array inside `backend/routes/studentRoutes.js`.
**Restarting the backend resets all data** back to the 3 sample students — this is intentional
(the project does not use any database).
