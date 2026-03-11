# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

WatchParty is a real-time YouTube watch party app. Users create/join rooms, watch synced YouTube videos, chat, and manage participants with role-based permissions (Host, Moderator, Participant). Live deployment at https://ytwatchparty.vercel.app/.

## Monorepo Structure

This is a two-package monorepo with no workspace manager — `frontend/` and `backend/` are independent npm projects with separate `node_modules`.

## Build & Run Commands

### Backend (Node.js + Express)
```
cd backend
npm install
node server.js            # production start
npx nodemon server.js     # dev with hot reload
```
The backend has no `dev` script in package.json — use `npx nodemon server.js` directly.

### Frontend (React + Vite)
```
cd frontend
npm install
npm run dev               # local dev server (Vite)
npm run build             # production build to dist/
npm run preview           # preview production build
```

### Tests
No test framework is configured in either package. The backend `test` script is a placeholder that exits with code 1.

### Lint / Typecheck
No linter or type checker is configured. The project uses plain JavaScript (CommonJS in backend, ESM in frontend).

## Environment Variables

Backend requires a `.env` file in `backend/` with:
- `PORT` — server port (default 4000)
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing JWT tokens

The `.env` is gitignored. A template exists at the top of `backend/.env`.

## Architecture

### Backend (`backend/`)

Single entry point: `server.js` — creates Express app, connects MongoDB, mounts REST routes, and initializes Socket.IO on the same HTTP server.

**Dual database design:**
- **MongoDB (via Mongoose)** — used for all persistent data: users, rooms, chat messages. Connection in `src/config/mongo.js`.
- **PostgreSQL (`pg`)** — listed as a dependency but not currently wired up anywhere in the code.

**REST API routes** (mounted under `app.use`):
- `/api/auth` → `src/routes/authRoutes.js` — register and login (JWT-based)
- `/api/rooms` → `src/routes/roomRoutes.js` — create room (auth-protected), get room by code

**Socket.IO events** (defined inline in `server.js`):
- `join_room` — joins a socket room, adds participant to DB, sends current video state to new joiner
- `video_action` — play/pause/seek; only Host or Moderator can control; persists state to Room document
- `send_message` — saves message to MongoDB, broadcasts to room (note: this handler is registered twice in server.js — once with DB persistence at line 43 and once as a simple broadcast at line 112)
- `promote_user` — Host can promote a participant to Moderator
- `disconnect` — logs disconnection

**Mongoose models** (`src/models/`):
- `User` — username, email, bcrypt-hashed password, avatar
- `Room` — roomCode, host ref, currentVideoId, isPlaying, currentTime, participants array with roles (Host/Moderator/Participant)
- `Message` — roomCode, sender ref, username, text, timestamp

**Middleware** (`src/middleware/`):
- `auth.js` — `protect` middleware: extracts Bearer JWT from Authorization header, verifies with JWT_SECRET, attaches `req.user`
- `errorHandler.js` — global error handler; hides stack traces in production

### Frontend (`frontend/`)

React 18 SPA with Vite bundler and Tailwind CSS. No router library — navigation is state-driven via `AppContext`.

**State management:**
- `context/AppContext.jsx` — single React Context providing: dark mode, current view, user, auth modal state, current room, sidebar state, and navigation/room lifecycle functions
- `useApp()` hook consumed by `App.jsx` to wire everything together

**View system** (in `views/`):
- `HomeView` — landing with clock, calendar, schedule list, join-room input
- `CreateRoomView` — room creation form
- `RoomView` — main room view with video player, chat panel, participants panel (responsive layout with mobile tabs)
- `GlobalChatView` — standalone chat outside of rooms

**Custom hooks** (`hooks/`):
- `useRoom` — room-level state: participants, messages, video URL, playback; currently uses mock data from `constants/data.js`
- `useChat` — reusable chat state with send function; also uses mock seed data
- `useDarkMode` — dark mode toggle

**Socket.IO client** (`socket.js`):
- Singleton socket instance pointing to `http://localhost:4000` with `autoConnect: false`
- The socket is imported but real-time integration with the hooks/context is not yet wired — the frontend currently operates on mock data

**API layer** (`api/roomApi.js`):
- `createRoom(username)` — POST to `/api/rooms/create` with JWT from localStorage
- `getRoomDetails(roomCode)` — GET room by code

**Role system** (`constants/data.js`):
- Three roles: `Host`, `Moderator`, `Participant`
- Host/Moderator can control video playback; only Host can promote users or manage participants
- `RoomView` currently hardcodes `MY_ROLE = ROLES.HOST` for demo purposes

**Utilities** — split across three files with some duplication:
- `utils/helpers.js` — general helpers (room code, YouTube ID extraction, initials, time formatting, clipboard)
- `utils/roomUtils.js` — duplicates `generateRoomCode`, `extractYouTubeId`, `buildEmbedUrl`, `buildInviteLink` from helpers.js
- `utils/userUtils.js` — duplicates `getInitials`, `generateUserId`, `formatTime` from helpers.js; adds `canControl`/`canManage` role checks

## API Base URL

All API/socket URLs are centralized in `frontend/src/api/config.js` (`API_BASE`). Change this single value when deploying to production.

## Deployment

Frontend is deployed on Vercel with SPA rewrites (`vercel.json`). Backend runs on a separate server (port 4000 by default).
