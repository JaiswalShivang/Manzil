# MANZIL

> **Stop Drifting. Start Leveling.**  
> A full-stack MERN gamified productivity web application engineered under strict Constructivist Bauhaus principles. Tasks become active directives; daily routines unlock equipment, and life progression physically renders onto a 6-layer paperdoll avatar rig.

---

## 🏛️ Design System & Philosophy

Manzil adheres strictly to **Constructivist Bauhaus** aesthetics:
- **Zero Border Radius (`border-radius: 0`)**: Pure planar geometry, sharp rectangular silhouettes, and functionalist hierarchy.
- **Color Palette**:
  - `BONE / CREAM` (`#F5F3EF`, `#FAF3E8`): Tactile parchment backgrounds.
  - `RAW INK` (`#141414`): Deep structural outlines (2px / 3px / 4px solid borders).
  - `CADMIUM RED` (`#E8402C`): Priority alerts, streak fires, critical directives.
  - `INTERNATIONAL BLUE` (`#2B4AE8`): Clearance levels, intellect markers, focus states.
  - `BAUHAUS YELLOW` (`#F2B705`): Requisition credits (Gold), creative milestones.
- **Brutalist Hard Shadows**: Tactile offset drop shadows (`shadow-brutal` = `4px 4px 0px #141414`, `shadow-brutal-lg` = `6px 6px 0px #141414`).
- **Typography**: Space Grotesk (technical headers), Archivo (impact numerals), Inter (body readability).

---

## ⚡ Key Features

### 1. Complete Quest CRUD & Gamification
- **Create**: Add directives with title, category, description, due date, and recurring status.
- **Read**: Live dashboard queue + comprehensive Quest Log with search keywords, status filters, and category toggles.
- **Update**: Modal editor (`PATCH /api/quests/:id`) with ownership checks, preventing tampering with rewards or completed status.
- **Delete**: Inline non-disruptive confirmation prompt (`PURGE? [YES] [NO]`) with zero browser `confirm()` interruptions.
- **Execute**: Instant optimistic UI completion, recalculating XP progress and coin balances with automatic rollback on network failure.
- **Server-Authoritative Math**: XP thresholds scale exponentially ($50 \times \text{level}^{1.5}$) calculated strictly on the backend.

### 2. 6-Layer Paperdoll Avatar Engine
- Modular layered viewport with zero sprite bleed:
  1. `Layer 0`: Base Operative Body (always active)
  2. `Layer 1`: Footwear / Boots & Trousers
  3. `Layer 2`: Tunics / Tactical Armor (Chest)
  4. `Layer 3`: Helmets / Hairstyles
  5. `Layer 4`: Melee Weapons & Arcane Staffs
  6. `Layer 5`: Elemental Auras & Energy Fields
- Real-time animated walk cycles (`spriteWalk` 4-frame CSS steps).
- Responsive equipment HUD with single-click unequip and equip actions.

### 3. The Vault (Requisition Shop)
- 18+ tactical gear items categorized by clearance levels.
- Hard diagonal caution-stripe overlays on high-level locked gear.
- Instant purchase and auto-mount to character paperdoll.
- Backend verification: user gold validation, clearance level check, inventory duplicates guard.

### 4. Bauhaus Loading Skeletons
- Initial-fetch skeleton screens with customized shimmering sweeps for:
  - Dashboard Quest Feed
  - Full Quest Log Grid
  - The Vault Equipment Catalog
  - Operative Profile Skill Meters & Tactical Storage
  - Avatar Viewport paperdoll stage

### 5. Accessibility & Responsiveness
- **Keyboard Navigation**: 100% interactive elements operable via Tab, Enter, and Space.
- **Focus Rings**: Universal 2px International Blue (`#2B4AE8`) focus outline across inputs and buttons.
- **Motion Accessibility**: Full `@media (prefers-reduced-motion: reduce)` support disabling infinite walk cycles and celebrations.
- **Semantic Structure**: Proper landmark tags (`<main>`, `<nav>`, `<header>`, `<footer>`, single `<h1>` per view) with descriptive ARIA labels.

---

## 🛠️ Architecture & Tech Stack

- **Client**: React 19, Vite, React Router 7, TanStack Query v5 (optimistic updates + error rollbacks), Lucide Icons, Canvas Confetti.
- **Server**: Node.js, Express, MongoDB & Mongoose ODM.
- **Authentication**: JWT access tokens (short-lived in-memory) + httpOnly refresh tokens in secure cookies.
- **Validation**: Strict schema validation via **Zod** on write endpoints.
- **Security**: Brute-force protection via `express-rate-limit`, CORS configuration, and parameterized queries.

---

## 🚀 Quick Start (Local Setup)

### 1. Clone & Prerequisites
- Node.js v18+ (tested up to v24)
- MongoDB instance (local or Atlas)

### 2. Backend Installation & Run
```bash
cd server
npm install

# Configure environment
cp .env.example .env
# Edit server/.env with your MONGODB_URI and JWT secrets

# Seed the Vault inventory items
npm run seed

# Start server
npm run dev
```
Backend runs on `http://localhost:5000`.

### 3. Frontend Installation & Run
```bash
cd client
pnpm install # or npm install

# Start Vite client
pnpm dev # or npm run dev
```
Client runs on `http://localhost:5173`.

---

## 📡 REST API Reference

### Auth (`/api/auth`)
- `POST /register`: Enlist new operative with codename, email, passcode.
- `POST /login`: Authenticate and receive JWT tokens.
- `POST /refresh`: Refresh expired access token via httpOnly cookie.
- `POST /logout`: Clear refresh cookie and invalidate session.

### Quests (`/api/quests`)
- `GET /`: Retrieve user's quests (supports `?status=pending|completed&category=...`).
- `POST /`: Submit new directive.
- `PATCH /:id`: Update directive details (ownership protected).
- `DELETE /:id`: Remove directive (ownership protected).
- `POST /:id/complete`: Execute quest and grant server-computed XP & Gold.

### Vault & Equipment (`/api/shop` & `/api/equip`)
- `GET /api/shop/items`: Retrieve all shop gear.
- `POST /api/shop/purchase/:itemId`: Buy item from Vault.
- `PATCH /api/equip`: Mount item onto character paperdoll.
- `PATCH /api/equip/unequip`: Dismount item from slot.

---

## 🛡️ Deliverables & Verification Checklist

- [x] Complete Quest CRUD (Create, Read, Update, Delete with inline confirmation)
- [x] Optimistic UI on mutations with rollback and visible error prompts
- [x] Custom Bauhaus loading skeletons across all views
- [x] Keyboard focus states (`#2B4AE8`) and ARIA labels on icon buttons
- [x] `prefers-reduced-motion` compliance
- [x] SEO meta tags, Open Graph, Twitter cards, `robots.txt`, and `sitemap.xml`
- [x] Server-side Zod validation and rate limiting
- [x] `.env.example` in both `/client` and `/server`
