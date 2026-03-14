# WKND — Weekend Planner

A web app that reads your YouTube watch history via Google OAuth and uses Claude AI to generate a personalized weekend plan based on your interests.

**Stack:** React + Vite · Node/Express · Firebase Auth · YouTube Data API v3 · Anthropic Claude

---

## Project Structure

```
wknd/
├── client/          # React frontend (Vite + Tailwind)
│   └── src/
│       ├── components/   Header, ActivityCard, Loading
│       ├── context/      AuthContext (Firebase)
│       ├── hooks/        useYouTube, usePlan
│       ├── lib/          firebase.js, api.js
│       └── pages/        Landing, Prefs, Results
├── server/          # Express API
│   ├── routes/      auth.js, youtube.js, plan.js
│   ├── middleware/  auth.js (Firebase token verification)
│   └── lib/         firebase.js, prompts.js
└── package.json     # Root scripts (runs both with concurrently)
```

---

## Setup

### 1. Firebase

1. Go to [Firebase Console](https://console.firebase.google.com) → Create a project
2. **Authentication** → Sign-in method → Enable **Google**
3. **Project Settings** → Your Apps → Add a **Web App** → copy the config
4. **Project Settings** → Service Accounts → Generate new private key → download JSON

### 2. Google Cloud Console

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Select your Firebase project
3. **APIs & Services** → Enable **YouTube Data API v3**
4. **APIs & Services** → Credentials → Your OAuth 2.0 Client ID
5. Add `http://localhost:5173` to **Authorized JavaScript Origins**

### 3. Environment variables

**`server/.env`** (copy from `server/.env.example`):
```env
ANTHROPIC_API_KEY=sk-ant-...
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
PORT=3001
CLIENT_URL=http://localhost:5173
```

**`client/.env`** (copy from `client/.env.example`):
```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=1:123456:web:abc123
```

### 4. Install & run

```bash
# Install all dependencies
npm run install:all

# Run both frontend and backend in parallel
npm run dev
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:3001

---

## How It Works

1. User clicks **Connect with Google** → Firebase Google OAuth popup
2. Firebase returns an **ID token** + Google OAuth **access token**
3. React stores both tokens and attaches them to every API request
4. Express verifies the Firebase ID token via Firebase Admin SDK
5. `/api/youtube/history` uses the access token to call YouTube Data API v3
6. `/api/plan/generate` sends watch history + user prefs to Claude
7. Claude analyzes viewing patterns and returns a structured JSON plan
8. React renders the plan as activity cards

---

## Deployment

**Backend** → Deploy to Railway, Render, or Fly.io. Set all env vars in the dashboard.

**Frontend** → Deploy to Vercel or Netlify. Set `VITE_*` env vars. Update `CLIENT_URL` in server env and add your production domain to Firebase OAuth authorized domains.
