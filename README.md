# 🧠 Smart Task Manager — For Students & Developers

A full-stack Trello-like project/task management app with **AI-powered task breakdown**, drag & drop, analytics, and deadline notifications.
Built with a scalable architecture using FastAPI (Python) and React (Vite + Tailwind CSS).

This project demonstrates full-stack development skills, clean architecture, API design, and real-world SaaS features.

---

## 🗂️ Project Structure

```
smart-task-manager/
├── backend/                  # Python FastAPI backend
│   ├── main.py               # App entry point
│   ├── config.py             # Settings & env vars
│   ├── requirements.txt
│   ├── models/               # MongoDB Pydantic models
│   │   ├── user.py
│   │   ├── board.py
│   │   ├── task_list.py
│   │   └── task.py
│   ├── controllers/          # Business logic
│   │   ├── auth_controller.py
│   │   ├── board_controller.py
│   │   ├── list_controller.py
│   │   ├── task_controller.py
│   │   ├── ai_controller.py
│   │   └── analytics_controller.py
│   ├── routes/               # API route definitions
│   │   ├── auth_routes.py
│   │   ├── board_routes.py
│   │   ├── list_routes.py
│   │   ├── task_routes.py
│   │   ├── ai_routes.py
│   │   └── analytics_routes.py
│   ├── middleware/           # Auth & error handlers
│   │   ├── auth_middleware.py
│   │   └── error_handler.py
│   ├── config/
│   │   └── database.py       # MongoDB connection
│   └── utils/
│       ├── jwt_utils.py
│       ├── password_utils.py
│       └── notification_utils.py
│
└── frontend/                 # React + Tailwind frontend
    ├── package.json
    ├── tailwind.config.js
    ├── .env.example
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── components/
        │   ├── Auth/
        │   │   ├── LoginForm.jsx
        │   │   └── RegisterForm.jsx
        │   ├── Board/
        │   │   ├── BoardCard.jsx
        │   │   ├── BoardGrid.jsx
        │   │   └── CreateBoardModal.jsx
        │   ├── Task/
        │   │   ├── TaskCard.jsx
        │   │   ├── TaskColumn.jsx
        │   │   ├── TaskDetailModal.jsx
        │   │   ├── CreateTaskModal.jsx
        │   │   └── DragDropBoard.jsx
        │   ├── Dashboard/
        │   │   ├── StatsWidget.jsx
        │   │   └── RecentActivity.jsx
        │   ├── Analytics/
        │   │   ├── ProductivityChart.jsx
        │   │   └── TaskStatusPie.jsx
        │   ├── Notifications/
        │   │   └── NotificationPanel.jsx
        │   └── UI/
        │       ├── Navbar.jsx
        │       ├── Sidebar.jsx
        │       ├── Button.jsx
        │       ├── Modal.jsx
        │       ├── Badge.jsx
        │       └── Loader.jsx
        ├── pages/
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   ├── DashboardPage.jsx
        │   ├── BoardPage.jsx
        │   └── AnalyticsPage.jsx
        ├── context/
        │   ├── AuthContext.jsx
        │   ├── BoardContext.jsx
        │   └── NotificationContext.jsx
        ├── services/
        │   ├── api.js            # Axios base instance
        │   ├── authService.js
        │   ├── boardService.js
        │   ├── taskService.js
        │   ├── aiService.js
        │   └── analyticsService.js
        ├── hooks/
        │   ├── useAuth.js
        │   ├── useBoards.js
        │   └── useTasks.js
        └── utils/
            ├── dateUtils.js
            ├── priorityUtils.js
            └── constants.js
```

---

## 🚀 Quick Start

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # fill in your secrets
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env       # set VITE_API_URL
npm run dev
```

---

## 🔑 Environment Variables

**Backend `.env`**
```
MONGODB_URL=mongodb://localhost:27017
DB_NAME=smart_task_manager
JWT_SECRET=your_super_secret_key
JWT_EXPIRE_HOURS=24
OPENAI_API_KEY=your_openai_key   # for AI features
```

**Frontend `.env`**
```
VITE_API_URL=http://localhost:8000/api
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login & get JWT |
| GET | `/api/boards` | Get all user boards |
| POST | `/api/boards` | Create board |
| GET | `/api/boards/:id/lists` | Get lists in board |
| POST | `/api/lists` | Create list |
| GET | `/api/tasks/:list_id` | Get tasks in list |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| PUT | `/api/tasks/:id/move` | Move task (drag & drop) |
| POST | `/api/ai/suggest` | AI task breakdown |
| POST | `/api/ai/generate` | Auto-generate tasks |
| GET | `/api/analytics/summary` | Task analytics |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, React DnD Kit |
| Backend | Python, FastAPI |
| Database | MongoDB + Motor (async) |
| Auth | JWT + bcrypt |
| AI | OpenAI API (GPT-4o-mini) |
| Charts | Recharts |
| State | React Context + useReducer |

---

## ✨ Features

- 🔐 JWT Authentication (Register/Login/Logout)
- 📋 Boards → Lists → Tasks (Trello-like structure)
- 🎯 Drag & Drop between lists
- 🤖 AI: Auto-generate tasks from a title
- 🤖 AI: Suggest task breakdown into subtasks
- 📊 Analytics: Completion rate, productivity chart
- 🔔 Deadline notifications (in-app)
- 📱 Fully responsive

---

## 🐛 Challenges Solved
- Fixed MongoDB serialization issues using custom serializer
- Resolved bcrypt compatibility errors
- Fixed duplicate API calls caused by React StrictMode
- Improved error handling for validation and database errors

---

## 📦 Deployment

- **Backend**: Railway / Render / VPS (Docker ready)
- **Frontend**: Vercel / Netlify
- **Database**: MongoDB Atlas (free tier)

---

## 👨‍💻 Author

- Muhammad Afzal
- Full-Stack Developer (MERN + FastAPI)

---

## ⭐ Support

- If you like this project, give it a ⭐ on GitHub!
