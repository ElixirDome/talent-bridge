# TalentBridge – Job Portal Web Application

TalentBridge is a full-stack job portal web application that allows users to explore job opportunities, build resumes, and view salary insights.

---

## 🚀 Features

### 👤 User Authentication
- User registration and login
- Data stored securely using MongoDB
- Session handled via localStorage

### 💼 Job Listings
- Browse jobs and internships
- Filter by role, location, and keywords
- Dynamic search suggestions

### 📊 Salary Insights
- View salary ranges by role, company, and location
- Export salary data as CSV

### 📝 Resume Builder
- Create and preview resume in real-time
- Save resume data to backend (MongoDB)
- Resume linked to logged-in user

### 🏢 Company Profiles
- View top hiring companies
- Display company stats and openings

---

## 🛠 Tech Stack

### Frontend
- HTML, CSS, JavaScript
- Dynamic DOM manipulation
- LocalStorage for temporary state

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)

---

## 🔗 API Endpoints

### User Routes
- POST /api/users/register
- POST /api/users/login
- POST /api/users/resume
project/
├── jobfinder/ # Frontend
└── jobportalbackend/ # Backend


---

## ⚙️ How to Run

### Backend
```bash
cd jobportalbackend
npm install
node server.js
Frontend
cd jobfinder
live-server

OR open:

http://127.0.0.1:5001/

