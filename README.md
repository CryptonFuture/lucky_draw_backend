# 🎲 Lucky Draw Application

A complete full-stack **Lucky Draw / Raffle / Giveaway** system built with:

| Layer | Technology |
|-------|------------|
| **Backend** | Node.js + Express.js + MongoDB |
| **Frontend** | React + Vite + Tailwind CSS |
| **Random Service** | Python (Flask) – Cryptographically secure winner selection |

---

## ✨ Features

- 🔐 JWT Authentication (Admin / Participant roles)
- 🏆 Create & manage multiple Lucky Draws
- 🎫 Participant entry system with unique ticket numbers
- 🎁 Multiple prizes support (1st, 2nd, 3rd place...)
- 🐍 **Python secure random** for fair winner selection (CSPRNG)
- 📊 Admin & Participant dashboards
- 📜 Entry history & winner announcements
- 🔒 Verification seed for transparency
- 📱 Fully responsive modern UI

---

## 🗂️ Project Structure

```
lucky-draw-app/
├── backend/              # Node.js Express API
│   ├── models/           # User, Draw, Entry
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── seed.js
│   └── server.js
├── frontend/             # React + Vite
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── context/
│       └── services/
├── python-service/       # Secure random winner selection
│   ├── app.py
│   └── requirements.txt
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Python 3.8+

### 1. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run seed          # Load demo data
npm run dev           # http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev           # http://localhost:5173
```

### 3. Python Service (for fair draws)
```bash
cd python-service
pip install -r requirements.txt
python app.py         # http://localhost:8000
```

> **Note:** If Python service is not running, the backend automatically falls back to Node.js `crypto.randomInt`.

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@luckydraw.com | admin123 |
| **Participant** | ali@example.com | pass123 |
| **Participant** | sara@example.com | pass123 |

---

## 📡 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/dashboard | Dashboard stats |
| GET | /api/draws | List draws |
| POST | /api/draws | Create draw (Admin) |
| GET | /api/draws/:id | Draw details |
| POST | /api/draws/:id/join | Join a draw |
| POST | /api/draws/:id/conduct | Conduct draw (Admin) |
| GET | /api/draws/my-entries | My entries |

### Python Service
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /select-winners | Securely select winner indices |

---

## 🎲 How Winner Selection Works

1. Admin clicks **Conduct Draw**
2. Backend collects all active entries
3. Calls Python service → uses `secrets` module (CSPRNG)
4. Returns random unique indices + verification seed
5. Winners assigned to prizes by rank
6. Seed stored for transparency/audit

If Python is offline → automatic fallback to Node.js `crypto.randomInt`.

---

## 🛠️ Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lucky_draw
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
PYTHON_SERVICE_URL=http://localhost:8000
```

---

## 📝 License

MIT License

**Built with ❤️ for fair & transparent lucky draws**
```# lucky_draw_backend
