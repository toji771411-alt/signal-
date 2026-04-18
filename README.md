# unibox — Communication Operating System

> AI-powered message triage that shows you only what matters.

![GitHub last commit](https://img.shields.io/github/last-commit/toji771411-alt/signal-)
![GitHub repo size](https://img.shields.io/github/repo-size/toji771411-alt/signal-)

---

## 🚀 Quick Start (Workspace)

This project is organized as a workspace. You can run both the frontend and backend from the root directory.

### 1. Installation
Install all dependencies for the root, backend, and frontend with one command:
```bash
npm run install:all
```

### 2. Environment Setup
Fill in your API keys in the `.env` files (or leave them blank to run in Demo mode).
- **Backend**: `signal/backend/.env`
- **Frontend**: `signal/frontend/.env`

### 3. Run the App
Start both services concurrently:
```bash
npm run dev
```

The application will be available at:
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

---

## 🏗️ Folder Structure

- `signal/backend`: Express.js server providing AI services and Firestore integration.
- `signal/frontend`: React (Vite) application with a modern, glassmorphic UI.
- `.`: Root workspace with concurrent run scripts.

---

## 🧠 Core Features

- **Unified Feed**: AI-triaged messages categorized into Attention, Social, and News.
- **Task Extraction**: Automatically extracts tasks from messages and organizes them by deadline.
- **Morning Briefing**: AI-generated summary of your most important messages.
- **AI Assistant**: Conversational interface to manage your workspace and get insights.

---

## 🔑 Environment Variables

### Backend (`signal/backend/.env`)
| Variable | Description |
|---|---|
| `PORT` | API port (default 3001) |
| `OPENAI_API_KEY` | OpenAI API key for real-time classification |
| `FIREBASE_PROJECT_ID` | Firebase project ID |

### Frontend (`signal/frontend/.env`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API URL |
| `VITE_FIREBASE_API_KEY` | Firebase API key |

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Zustand, Framer Motion.
- **Backend**: Node.js, Express, Firebase Admin SDK.
- **AI**: OpenAI GPT-3.5/GPT-4 (supporting mock mode for local development).

---

## 📜 License

MIT
