# 🏏 Crictalxx - The Cricket Quiz & Honors Certification Arena

[![Live on Render](https://img.shields.io/badge/Live%20App-crictalxx.onrender.com-brightgreen?style=for-the-badge&logo=render)](https://crictalxx.onrender.com)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Tirthdave01%2FCrictalxx-blue?style=for-the-badge&logo=github)](https://github.com/Tirthdave01/Crictalxx)

> 🌐 **Live Deployment:** [https://crictalxx.onrender.com](https://crictalxx.onrender.com)

**Crictalxx** is a full-stack cricket trivia and digital certification arena built with **React + Vite + Tailwind CSS** on the frontend, and a **Node.js / Express backend with SQLite** persistence.

---

## 🌟 Key Features

### 1. 🏏 Match Quiz Modes & Difficulty Tiers
* **🟢 Powerplay (Easy):** Cricket fundamentals, legendary milestones, 264 ODI knocks, and boundary basics.
* **🟡 Middle Overs (Medium):** Tactical team trivia, iconic bowler spells, franchise lore, and ICC tournament moments.
* **🔴 Death Overs (Hard):** Brain-busting trivia for true cricket savants: first third-umpire TV dismissal, 9-franchise journeymen, 10-wicket hauls, and obscure MCC Law 37 run-out disputes.
* **🕵️ Guess The Player:** Progressive clue dossiers (Debut year, Jersey # & Role, Records, Nickname). Fewer clues revealed = higher points!
* **⚡ The Super Over (Rapid Fire):** Fast-paced cricket trivia with real-time countdown timer.
* **🎯 50:50 DRS Review Lifeline:** Eliminates two wrong answers on any tricky delivery!

### 2. 📜 Honors Certificate Engine
* Users scoring $\ge 75\%$ or $\ge 80\%$ automatically earn an **Official Certificate of Cricket Excellence**.
* **Personalized with:**
  * Recipient Name
  * Match Challenge & Score Percentage
  * Official Honors Tier (🥇 Gold Tier $\ge 90\%$, 🥈 Silver Tier $\ge 75\%$, 🥉 Bronze)
  * Unique Verification ID (`CRIC-XXXX-XXXX`)
  * **Authentic Signature by Founder & Chief Match Referee: Tirth**
* **Instant Export:** Download as a high-resolution PDF or print ready for framing.

### 3. 🔍 Public Certificate Verification
* Each certificate comes with a unique ID that can be verified online at `/verify` or via direct URL (`?verify=CRIC-XXXX-XXXX`).

### 4. 📊 Cricketer Dashboard
* **Career Innings Stats:** Innings played, Batting Average (Accuracy %), Highest Score, Strike Rate (speed).
* **Trophy Cabinet & Badges:** Debut Match, Half-Century, Century Club, Official Master.
* **Certificates Vault:** One-click gallery to preview and download all earned certificates.
* **Match History Log:** Full breakdown of past deliveries and review explanations.

### 5. 🛡️ Match Referee Console (Admin Panel)
* **Single Question Creator:** Form with categories, difficulty (Easy/Medium/Hard), 4 options, progressive clues, and trivia explanations.
* **Inline Difficulty Controls:** Switch question difficulty with a single click.
* **Bulk Question Import:** Paste JSON arrays to upload dozens of questions in seconds.
* **Question Bank Manager:** Real-time search, filter by category and difficulty, and delete questions.

---

## ☁️ Deployment on Render

This project is configured as a unified full-stack application ready to deploy to **Render** as a single free Web Service:

### Render Web Service Settings:
1. **Repository:** Connect your GitHub repository.
2. **Environment / Runtime:** `Node`
3. **Build Command:** `npm run build`
4. **Start Command:** `npm start`
5. **Environment Variables:**
   * `NODE_VERSION`: `22` (requires Node 22+ for built-in SQLite support)
   * `PORT`: `10000` (Render sets this automatically)

Once deployed, Render provides a public URL (e.g. `https://crictalxx.onrender.com`).

---

## 💻 Local Development

### Prerequisites:
- **Node.js**: v22.5.0 or newer
- **npm**: v10 or newer

### Setup & Run:
```bash
# 1. Install all dependencies and build client
npm run build

# 2. Run backend (serves both API and production frontend)
npm start

# Or run client & server concurrently for development:
# Terminal 1:
npm run server

# Terminal 2:
npm run client
```

* Frontend dev server: `http://localhost:5173`
* Backend server & API: `http://localhost:5100`

### Default Login Accounts:
* **Admin:** `admin@crictalxx.com` / `admin123`
* **Player:** `player@crictalxx.com` / `player123`
*(Or use the 1-click Quick Login switcher in the app)*

---

## 📁 Directory Structure
```
crictalxx/
├── client/                     # React + Vite + Tailwind CSS Frontend
│   ├── public/
│   │   └── signature.png       # Transparent signature of Founder Tirth
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── QuizPlayer.jsx
│   │   │   ├── GuessPlayerMode.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── VerifyCertificate.jsx
│   │   │   └── CertificateModal.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   └── vite.config.js
├── server/                     # Node.js + Express Backend
│   ├── db.js                   # Built-in SQLite database connection & schema
│   ├── seed.js                 # 25 curated questions & match arenas
│   └── index.js                # Full REST API endpoints & static SPA server
├── render.yaml                 # Render Infrastructure-as-Code Blueprint
├── .gitignore
├── package.json
└── README.md
```

---

## 📜 License & Credits
Crafted for cricket lovers by **Tirth**.
