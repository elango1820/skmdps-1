# 🕯️ SKMDPS Backend — Setup Guide

**Seer Karuneegar Madalaya Tharuma Paribalana Sangam**
Node.js / Express Backend Server

---

## 📁 Project Structure

```
skmdps-backend/
├── server.js              ← Main Express server
├── package.json           ← Dependencies
├── .env.example           ← Environment config template
├── .gitignore
├── data/
│   ├── contacts.json      ← Auto-created: contact form submissions
│   └── members.json       ← Auto-created: committee members
└── public/
    └── index.html         ← Copy your frontend HTML here
```

---

## ⚙️ Installation & Setup

### 1. Install Node.js
Download from https://nodejs.org (v16 or higher)

### 2. Install dependencies
```bash
cd skmdps-backend
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env with your email/SMTP settings
```

### 4. Place the frontend HTML
```bash
mkdir public
# Copy index.html into the public/ folder
cp /path/to/index.html public/
```

### 5. Start the server

**Development (auto-restart on changes):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Open your browser: **http://localhost:3000**

---

## 🌐 API Endpoints

| Method | Endpoint              | Description                          |
|--------|-----------------------|--------------------------------------|
| GET    | `/api/health`         | Server health check                  |
| GET    | `/api/sangam/info`    | Sangam details (name, address, etc.) |
| GET    | `/api/members`        | All committee members                |
| GET    | `/api/members/:id`    | Single member by ID                  |
| POST   | `/api/contact`        | Submit contact form                  |
| GET    | `/api/contacts`       | View all messages (admin use)        |
| POST   | `/api/contacts/:id/read` | Mark message as read              |

---

## 📬 Contact Form API

**POST** `/api/contact`

```json
{
  "name":    "Visitor Name",
  "email":   "visitor@email.com",
  "phone":   "9876543210",
  "subject": "General Enquiry",
  "message": "Your message here"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Thank you! Your message has been received.",
  "id":      "abc12345-..."
}
```

---

## 📧 Email Notifications (Optional)

To receive contact form submissions by email:
1. Enable 2FA in your Gmail account
2. Generate an **App Password** (Google Account → Security → App Passwords)
3. Set `EMAIL_USER` and `EMAIL_PASS` in `.env`

---

## 🚀 Deploy to Production (Render / Railway)

1. Push code to GitHub
2. Connect repo to [Render](https://render.com) or [Railway](https://railway.app)
3. Set environment variables in the dashboard
4. Deploy — your site will be live on a public URL

---

## 📞 Contact
**Sangam President:** +91 94418 82811
**Address:** 123/19, Periya Theru, Tiruvannamalai – 606 601

🙏 *அருட்பெருஞ்ஜோதி தனிப்பெருங்கருணை*
