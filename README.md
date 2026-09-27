# Student Opportunity Tracker

A comprehensive full-stack web application designed for students to discover, track, and manage career opportunities like internships, hackathons, and certifications. Built with the MERN stack (MongoDB, Express, React, Node.js).

## 🚀 Features

### Student Features
- **Discover Opportunities**: Search and filter opportunities by type, mode, and deadlines.
- **Bookmark**: Save interesting opportunities for later.
- **Application Tracking**: Track application status (Interested -> Applied -> Shortlisted -> Completed).
- **Dashboard**: Get a high-level view of your application stats, upcoming deadlines, and recently added opportunities.
- **Profile Management**: Update your college, course, and skills.

### Admin Features
- **Dashboard**: View platform statistics (total students, opportunities, applications).
- **Manage Opportunities**: Full CRUD functionality for opportunities.

## 🛠️ Tech Stack
- **Frontend**: React.js, Vite, React Router DOM, Axios, Lucide React (Icons), Vanilla CSS
- **Backend**: Node.js, Express.js, JWT Authentication, bcryptjs
- **Database**: MongoDB, Mongoose

## 📁 Architecture & Structure
```text
student-opportunity-tracker/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (Auth)
│   │   ├── layouts/        # Page layouts (Sidebar, Auth)
│   │   ├── pages/          # View components
│   │   ├── services/       # Axios API integration
│   │   ├── App.jsx         # App router
│   │   └── index.css       # Global design system & UI tokens
│   └── package.json
├── server/                 # Node/Express Backend
│   ├── config/             # DB config
│   ├── controllers/        # Route logic handlers
│   ├── middleware/         # Auth & error middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── services/           # External/AI service placeholders
│   ├── utils/              # Helper functions (JWT)
│   ├── seed.js             # DB Seeder script
│   └── server.js           # Entry point
└── README.md
```

## ⚙️ Prerequisites
- Node.js
- MongoDB (running locally or a MongoDB Atlas URI)

## 📦 Installation & Setup

### 1. Database Setup
Ensure you have MongoDB running locally, or have an Atlas connection string.

### 2. Backend Setup
```bash
cd server
npm install
```
The `.env` file should contain:
```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/student_opportunity_tracker
JWT_SECRET=supersecretjwtkey_12345
CLIENT_URL=http://localhost:5173
```
*Note: An `.env` file is already created.*

#### Seed Database
To populate the database with an Admin account and sample opportunities:
```bash
npm run seed
```
*Admin credentials:*
Email: `admin@test.com`
Password: `password123`

#### Start Backend
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```
The application will be running at `http://localhost:5173`.

## 🤖 Future AI Integration
The architecture is designed to easily integrate AI services later. A placeholder exists in `server/services/recommendationService.js`. Future plans include:
- Skill-based matching & resume analysis
- Personalized opportunity recommendations
- Skill-gap analysis
