# SIGNAL — Communication Operating System

> AI-powered message triage that shows you only what matters.

---

## 🚀 Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env   # fill in your keys (or leave blank for demo)
npm install
npm run dev            # starts on http://localhost:3001
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env   # fill in Firebase keys (or leave blank for demo)
npm install
npm run dev            # starts on http://localhost:5173
```

Open **http://localhost:5173** → click **"Try Demo Mode"** to use without any API keys.

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required |
|---|---|---|
| `PORT` | API port (default 3001) | No |
| `FIREBASE_PROJECT_ID` | Firebase project ID | For persistence |
| `FIREBASE_CLIENT_EMAIL` | Service account email | For persistence |
| `FIREBASE_PRIVATE_KEY` | Service account private key | For persistence |
| `OPENAI_API_KEY` | OpenAI key for real AI | No (mock used) |
| `FRONTEND_URL` | CORS origin | No |

### Frontend (`frontend/.env`)

| Variable | Description | Required |
|---|---|---|
| `VITE_API_URL` | Backend URL | Yes |
| `VITE_FIREBASE_API_KEY` | Firebase web API key | For Google login |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | For Google login |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | For Google login |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | For Google login |

---

## 🔥 Firebase Setup (Optional but Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication → Google** sign-in provider
4. Enable **Firestore Database** (start in test mode)
5. **Frontend keys**: Project Settings → Your apps → Web app → Copy config
6. **Backend keys**: Project Settings → Service accounts → Generate new private key

---

## 🧠 AI Mode

| Mode | How it works |
|---|---|
| **Mock (default)** | Keyword-based classification. Works with zero config. |
| **OpenAI** | Set `OPENAI_API_KEY` in `backend/.env` — uses GPT-3.5-turbo |

---

## 📁 Project Structure

```
signal/
├── backend/
│   ├── src/
│   │   ├── index.js              # Express entry point
│   │   ├── routes/
│   │   │   ├── messages.js       # POST /messages/analyze-all
│   │   │   ├── tasks.js          # GET/POST /tasks, POST /tasks/extract
│   │   │   ├── briefing.js       # POST /briefing
│   │   │   └── assistant.js      # POST /assistant
│   │   ├── services/
│   │   │   ├── aiService.js      # Mock AI + OpenAI wrapper
│   │   │   └── firebaseService.js# Firestore + in-memory fallback
│   │   └── data/
│   │       └── mockMessages.js   # 15 realistic mock messages
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── App.jsx               # Routes
    │   ├── pages/
    │   │   ├── Login.jsx         # Google + demo login
    │   │   ├── Feed.jsx          # Unified message feed
    │   │   ├── Tasks.jsx         # Task list (Today/Week/Later)
    │   │   └── Assistant.jsx     # AI chat interface
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── Sidebar.jsx
    │   │   │   └── AppShell.jsx
    │   │   ├── feed/
    │   │   │   ├── MessageCard.jsx
    │   │   │   └── MorningBriefing.jsx
    │   │   ├── tasks/
    │   │   │   └── TaskCard.jsx
    │   │   └── assistant/
    │   │       └── ChatBubble.jsx
    │   ├── store/
    │   │   ├── authStore.js      # Zustand auth state
    │   │   └── feedStore.js      # Zustand feed/tasks state
    │   └── lib/
    │       ├── api.js            # Axios API client
    │       ├── firebase.js       # Firebase SDK init
    │       └── utils.js          # Helpers
    └── package.json
```

---

## 🎯 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/messages/analyze` | Analyze a single message |
| POST | `/messages/analyze-all` | Analyze all mock messages |
| GET | `/messages/feed` | Get analyzed feed |
| GET | `/tasks` | Get all tasks |
| POST | `/tasks` | Create a task |
| POST | `/tasks/extract` | Extract tasks from message |
| PATCH | `/tasks/:id` | Update a task |
| POST | `/briefing` | Generate morning briefing |
| POST | `/assistant` | Chat with AI assistant |

---

## 🎨 Pages

| Route | Page | Description |
|---|---|---|
| `/login` | Login | Google auth + demo mode |
| `/feed` | Feed | Unified AI-triaged message feed |
| `/tasks` | Tasks | Extracted tasks grouped by deadline |
| `/assistant` | Assistant | Chat interface for commands |
