# Life RPG — Cozy Lo-Fi Study Room Edition ☕🪴

> A complete, production-grade MERN gamified productivity web application that turns real-world study goals and daily habits into a cozy RPG progression system.

---

## 📖 Concept & Overview

Instead of harsh corporate dashboards or generic pixel battlers, **Life RPG** frames your character as your **personal study room**. As you accomplish real-world quests, you earn **Focus Points (FP)** and **Cozy Coins**. Leveling up and completing quests unlocks decorations (plants, lamps, posters, mugs, rugs, and wallpapers) that dynamically populate your interactive study nook.

### Core Gamification Elements
- **Quests & Focus Points (XP)**: Tasks award server-calculated XP ($50 \times \text{level}^{1.5}$) and Cozy Coins. Client-submitted reward values are never trusted.
- **Leveling Up Your Space**: Crossing the XP threshold triggers a cozy celebration and unlocks new store items.
- **Study Streaks**: Real calendar-day streak tracking with bonus XP and coins for 3, 7, 14, and 30-day milestones.
- **4 RPG Skill Meters**: Quests increment **Intellect**, **Vitality**, **Discipline**, and **Creativity**.
- **The Cozy Corner Shop**: Purchase 18+ furniture and decoration items that physically render inside your study room.
- **Ambient Lo-Fi Sound Generator**: Offline Web Audio API synthesizing soothing rain and warm room tones.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 19, Vite, React Router 7, TanStack Query (with optimistic updates and rollback), Tailwind CSS, Framer Motion, Canvas Confetti.
- **Backend**: Node.js, Express, Mongoose (MongoDB ODM), custom JWT auth (access token in memory + httpOnly refresh cookie), rate limiting, Zod validation.
- **Monorepo**:
  - `/client`: React Single Page Application
  - `/server`: Express REST API

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **MongoDB**: MongoDB Atlas connection string or local MongoDB instance (`mongodb://localhost:27017/liferpg`)

### 2. Backend Setup
```bash
cd server
npm install

# Copy and configure environment variables
cp .env.example .env
# Set your MONGODB_URI in server/.env

# Seed the shop catalog with 18+ cozy room items
node utils/seedData.js

# Start backend server
npm run dev
```
The server will run on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd client
pnpm install # or npm install

# Start Vite dev server
pnpm dev # or npm run dev
```
The client will open on `http://localhost:5173` with automatic API proxying to port 5000.

---

## 🔒 Security Highlights
1. **No Client Math Trust**: XP, coin additions, streak computations, and inventory validations are executed strictly on the backend.
2. **User Isolation**: All queries (`/api/quests/*`, `/api/users/me`) strictly scope by `req.user.id`.
3. **JWT Rotation & httpOnly Cookies**: Refresh tokens are stored in secure httpOnly cookies with matching hashes in the database.
4. **Rate Limiting**: Brute force protection on auth endpoints via `express-rate-limit`.
5. **Schema Validation**: Server-side request sanitization using Zod.
