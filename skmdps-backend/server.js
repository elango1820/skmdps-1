// ═══════════════════════════════════════════════════════════
//  Seer Karuneegar Madalaya Tharuma Paribalana Sangam
//  Node.js / Express Backend Server
// ═══════════════════════════════════════════════════════════

const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const fs         = require('fs');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', '*'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the frontend HTML as static files
app.use(express.static(path.join(__dirname, 'public')));

// ── Data Storage (JSON file-based) ──────────────────────────
const DATA_DIR      = path.join(__dirname, 'data');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');
const MEMBERS_FILE  = path.join(DATA_DIR, 'members.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// Initialize contacts file
if (!fs.existsSync(CONTACTS_FILE)) {
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify([], null, 2));
}

// Initialize members file with committee data
if (!fs.existsSync(MEMBERS_FILE)) {
  const members = {
    officeBearers: [
      { id: 1, name: "P.V. Shanmugam",       role: "Honorary President", roleTA: "கௌரவத் தலைவர்",   phone: "",             avatar: "🌟" },
      { id: 2, name: "V.M. Annamalai",        role: "President",          roleTA: "தலைவர்",           phone: "9441882811",   avatar: "👑" },
      { id: 3, name: "R. Govindarasu",         role: "Secretary",          roleTA: "செயலாளர்",         phone: "",             avatar: "📋" },
      { id: 4, name: "R. Harikumar",           role: "Treasurer",          roleTA: "பொருளாளர்",        phone: "",             avatar: "💰" },
      { id: 5, name: "S. Iniyan",              role: "Deputy President",   roleTA: "துணைத்தலைவர்",    phone: "",             avatar: "🤝" },
      { id: 6, name: "R. Palani",              role: "Deputy President",   roleTA: "துணைத்தலைவர்",    phone: "",             avatar: "🤝" },
      { id: 7, name: "K.B. Velmurugan",        role: "Deputy Secretary",   roleTA: "துணை செயலாளர்",   phone: "",             avatar: "📝" },
      { id: 8, name: "M. Vetrivelan",          role: "Deputy Secretary",   roleTA: "துணை செயலாளர்",   phone: "",             avatar: "📝" }
    ],
    executiveMembers: [
      { id: 9,  name: "T. Ramasamy",           role: "Executive Member",   phone: "" },
      { id: 10, name: "M. Kuppusamy",           role: "Executive Member",   phone: "" },
      { id: 11, name: "A. Karthikeyan",         role: "Executive Member",   phone: "" },
      { id: 12, name: "P.S. Manivasagam",       role: "Executive Member",   phone: "" },
      { id: 13, name: "S. Sridhar Natarajan",   role: "Executive Member",   phone: "" },
      { id: 14, name: "V. Selvaraj",            role: "Executive Member",   phone: "" },
      { id: 15, name: "R. Palani",              role: "Executive Member",   phone: "" },
      { id: 16, name: "G. Parthiban",           role: "Executive Member",   phone: "" },
      { id: 17, name: "R. Ravichandran",        role: "Executive Member",   phone: "" },
      { id: 18, name: "K. Arunesan",            role: "Executive Member",   phone: "" },
      { id: 19, name: "G. Elamaran",            role: "Executive Member",   phone: "" },
      { id: 20, name: "G. Bharathrajan",        role: "Executive Member",   phone: "" },
      { id: 21, name: "P. Elango",              role: "Executive Member",   phone: "" }
    ]
  };
  fs.writeFileSync(MEMBERS_FILE, JSON.stringify(members, null, 2));
}

// ── Helper: read/write JSON ─────────────────────────────────
function readJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}
function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ══════════════════════════════════════════════════════════
//  API ROUTES
// ══════════════════════════════════════════════════════════

// ── Health Check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status:  'ok',
    message: 'SKMDPS Server is running 🙏',
    time:    new Date().toISOString()
  });
});

// ── GET /api/members ─────────────────────────────────────────
//    Returns all committee members
app.get('/api/members', (req, res) => {
  const members = readJSON(MEMBERS_FILE);
  if (!members) return res.status(500).json({ error: 'Could not read members data' });
  res.json({ success: true, data: members });
});

// ── GET /api/members/:id ─────────────────────────────────────
app.get('/api/members/:id', (req, res) => {
  const members = readJSON(MEMBERS_FILE);
  const id = parseInt(req.params.id);
  const all = [...members.officeBearers, ...members.executiveMembers];
  const member = all.find(m => m.id === id);
  if (!member) return res.status(404).json({ error: 'Member not found' });
  res.json({ success: true, data: member });
});

// ── POST /api/contact ────────────────────────────────────────
//    Submit contact form
app.post('/api/contact',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('phone').optional().trim().isLength({ max: 15 }),
    body('subject').optional().trim().isLength({ max: 100 }),
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, phone, subject, message } = req.body;

    // Save contact to JSON file
    const contacts = readJSON(CONTACTS_FILE) || [];
    const newContact = {
      id:        uuidv4(),
      name,
      email,
      phone:     phone || '',
      subject:   subject || 'General Enquiry',
      message,
      status:    'unread',
      createdAt: new Date().toISOString()
    };
    contacts.push(newContact);
    writeJSON(CONTACTS_FILE, contacts);

    console.log(`📬 New contact from: ${name} <${email}> — ${subject}`);

    res.json({
      success: true,
      message: 'Thank you! Your message has been received. We will contact you soon. 🙏',
      id:      newContact.id
    });
  }
);

// ── GET /api/contacts ─────────────────────────────────────────
//    Admin: list all contact submissions (protect in production!)
app.get('/api/contacts', (req, res) => {
  const contacts = readJSON(CONTACTS_FILE) || [];
  res.json({
    success: true,
    count:   contacts.length,
    data:    contacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  });
});

// ── GET /api/contacts/:id/read ────────────────────────────────
//    Mark contact as read
app.post('/api/contacts/:id/read', (req, res) => {
  const contacts = readJSON(CONTACTS_FILE) || [];
  const idx = contacts.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Contact not found' });
  contacts[idx].status = 'read';
  writeJSON(CONTACTS_FILE, contacts);
  res.json({ success: true, message: 'Marked as read' });
});

// ── GET /api/sangam/info ──────────────────────────────────────
//    Sangam basic info
app.get('/api/sangam/info', (req, res) => {
  res.json({
    success: true,
    data: {
      name:         "Seer Karuneegar Madalaya Tharuma Paribalana Sangam",
      nameTA:       "சீர்கருணீகர் மடாலய தர்ம பரிபாலன சங்கம்",
      regNo:        "14/2011",
      regDate:      "19.01.2011",
      address:      "123/19, Periya Theru, Tiruvannamalai – 606 601",
      district:     "Tiruvannamalai",
      state:        "Tamil Nadu",
      pincode:      "606601",
      phone:        "9441882811",
      presidentPhone: "9441882811",
      email:        "",
      founded:      "2011",
      motto:        "அருட்பெருஞ்ஜோதி தனிப்பெருங்கருணை",
      hours: {
        morning: "6:00 AM – 9:00 AM",
        evening: "5:00 PM – 8:00 PM"
      }
    }
  });
});

// ── Catch-all: serve index.html (SPA fallback) ───────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start Server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║   🕯️  SKMDPS Web Server Started                      ║');
  console.log(`║   🌐  http://localhost:${PORT}                          ║`);
  console.log('║   📍  Tiruvannamalai – 606 601                        ║');
  console.log('║   🙏  அருட்பெருஞ்ஜோதி தனிப்பெருங்கருணை            ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log('');
  console.log('  API Endpoints:');
  console.log(`  GET  /api/health          → Server health check`);
  console.log(`  GET  /api/sangam/info     → Sangam details`);
  console.log(`  GET  /api/members         → All committee members`);
  console.log(`  POST /api/contact         → Submit contact form`);
  console.log(`  GET  /api/contacts        → View all messages (admin)`);
  console.log('');
});

module.exports = app;
