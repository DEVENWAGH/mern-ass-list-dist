# MERN Agent Manager

---

## Assignment Details

This project was completed as a part of the Machine Test for MERN Stack Developer at CSTech Infosolutions Private Limited.

- **Assignment Link:** [Machine Test Details](https://cstechmk.notion.site/Machine-Test-for-MERN-Stack-Developer-17dc36d8cc4c80f1ae02dcd0ca8b6d61?pvs=4)
- **Submission Deadline:** 17 May, 2025

---

# MERN Agent Manager

A MERN stack application for user login, agent management, and uploading/distributing contact lists among agents.

## Features

- **User Login**: Secure login with JWT authentication.
- **Agent Management**: Add, edit, delete agents (name, email, phone, password, status).
- **Upload & Distribute Lists**: Upload CSV/XLSX/XLS files, validate, and distribute contacts equally among agents.
- **View Distributions**: See how contacts are distributed per agent and per file.
- **Validation & Error Handling**: Robust validation for forms and file uploads.

## Tech Stack

- **Frontend**: React.js (Vite)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT

## Setup Instructions

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/mern-ass.git
cd mern-ass
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory with the following:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Create a `.env` file in the `frontend` directory with the following:

```
VITE_API_URL=http://localhost:5000
```

> Replace `your_mongodb_connection_string` and `your_jwt_secret` with your own values.

### 3. Install Dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

### 4. Run the Application

#### Start Backend

```bash
cd backend
npm run dev
```

#### Start Frontend

```bash
cd ../frontend
npm run dev
```

- Backend runs on [http://localhost:5000](http://localhost:5000)
- Frontend runs on [http://localhost:5173](http://localhost:5173)

### 5. Usage

- Register a new admin user or use provided credentials.
- Login as admin.
- Add agents (minimum 1, recommended 5 for even distribution).
- Upload a CSV/XLSX/XLS file with columns: `FirstName`, `Phone`, `Notes`.
- View distributed lists and agent assignments.

### 6. File Upload Format

- Accepted formats: `.csv`, `.xlsx`, `.xls`
- Required columns: `FirstName`, `Phone`, `Notes`
- Max file size: 5MB

## Live Demo

- Backend: [https://mern-ass.onrender.com](https://mern-ass.onrender.com)
- Frontend: [https://mern-ass.vercel.app/](https://mern-ass.vercel.app/)

## Troubleshooting

- Ensure MongoDB is running and accessible.
- Check `.env` configuration.
- For CORS issues, verify `FRONTEND_URL` in `.env` matches your frontend URL.

## License

MIT

---

**Thank you CSTech Infosolutions Private Limited for the opportunity to work on this project as part of the Full Stack Development internship.**
