# Study Room Mock (Client)

Collaborative EdTech frontend for the Study Room project.

## What this app does
- Authenticated dashboard layout (AppLayout)
- Study rooms, profiles, community, pricing/promise/changelog pages
- Practice area:
  - Mock interview UI
  - Code playground UI
  - Leaderboard / Study plans / Pair code setup pages

## Tech stack
- React
- Vite
- React Router
- Tailwind CSS
- (Code playground) Monaco editor (@monaco-editor/react)

## Routes (React Router)
- Public:
  - `/` → Home
  - `/login` → Login
  - `/signup` → Signup
  - `/forgot-password` → ForgotPassword
  - `/pricing` → Pricing
  - `/promise` → Promise
  - `/changelog` → Changelog
  - `/room/:roomId` → Room
- Authenticated (inside `AppLayout`):
  - `/home` → Dashboard
  - `/rooms` → Rooms
  - `/profile` → Profile
  - `/community` → Community
  - `/refer` → ReferAndEarn
  - `/practice/leaderboard` → practice/leaderboard
  - `/practice/mock-interview` → practice/MockInterview
  - `/practice/playground` → practice/Playground
  - `/practice/study-plans` → practice/StudyPlans
  - `/practice/pair-code` → practice/PairCodeSetup

## Local development
> Prerequisite: backend API should be running (the frontend is built to call backend endpoints).

### Start
1. Install dependencies:
   ```bat
   cd client
   npm install
   ```
2. Run dev server:
   ```bat
   npm run dev
   ```
3. Open the URL shown by Vite.

## Build for production
```bat
cd client
npm run build
```

## Project structure (high level)
- `src/App.jsx` – router configuration
- `src/pages/*` – page components
- `src/pages/components/*` – shared UI layout components
- `src/pages/practice/*` – practice feature pages

## Notes
- This README is intentionally focused on how to run the client and how routing is wired.
- If you see runtime/API errors, ensure the backend is up and reachable from your browser environment.

