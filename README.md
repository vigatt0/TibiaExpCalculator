# TibiaExpCalculator

A web utility for Tibia players featuring an **EXP Goal Calculator** with user authentication and goal tracking. Built with Vue 3 and Node.js/Express.

## Features

- **EXP Goal Calculator** – Calculate experience needed using Tibia's official formula:
  `TotalExp = (50/3) * (L³ - 6L² + 17L - 12)`
- **User Authentication** – Register and login with JWT-based auth
- **Goal Dashboard** – Save, view, and delete your leveling goals
- **Dark Theme** – Game-friendly dark UI with TailwindCSS

## Tech Stack

| Layer      | Technology                         |
|------------|------------------------------------|
| Frontend   | Vue 3 (Composition API), Vite, TailwindCSS |
| Backend    | Node.js, Express.js                |
| Database   | MongoDB with Mongoose              |
| Auth       | JWT (JSON Web Tokens), bcryptjs    |

## Project Structure

```
├── client/          # Vue 3 frontend (Vite)
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── views/       # Page-level components
│       ├── stores/      # Pinia state management
│       ├── router/      # Vue Router config
│       └── utils/       # EXP calculator, API client
├── server/          # Express.js backend
│   └── src/
│       ├── controllers/ # Route handlers
│       ├── middleware/   # Auth middleware
│       ├── models/      # Mongoose schemas
│       ├── routes/      # API route definitions
│       └── utils/       # EXP calculation logic
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

### Backend Setup

```bash
cd server
cp .env.example .env   # Edit with your MongoDB URI and JWT secret
npm install
npm start              # Starts on port 3000
```

### Frontend Setup

```bash
cd client
npm install
npm run dev            # Starts on port 5173, proxies /api to backend
```

### Running Tests

```bash
cd server
npm test
```

## API Endpoints

| Method | Endpoint            | Auth | Description              |
|--------|---------------------|------|--------------------------|
| POST   | /api/auth/register  | No   | Register a new user      |
| POST   | /api/auth/login     | No   | Login and receive JWT    |
| GET    | /api/auth/me        | Yes  | Get current user profile |
| POST   | /api/calculator     | No   | Calculate EXP goal       |
| GET    | /api/goals          | Yes  | List user's saved goals  |
| POST   | /api/goals          | Yes  | Save a new goal          |
| DELETE | /api/goals/:id      | Yes  | Delete a goal            |
| GET    | /api/health         | No   | Health check             |

## Database Schema

### User
- `username` (String, unique, 3-30 chars)
- `email` (String, unique)
- `password` (String, hashed with bcrypt)

### Goal
- `user` (ObjectId, ref: User)
- `characterName` (String)
- `currentLevel` / `targetLevel` (Number)
- `days` / `hoursPerDay` (Number)
- `currentExp` / `targetExp` / `remainingExp` / `expPerDay` / `expPerHour` (Number, computed)