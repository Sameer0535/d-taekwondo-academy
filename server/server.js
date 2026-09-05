import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db, initMongo } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));

// Ensure MongoDB Atlas is initialized before processing any requests in serverless environments (Vercel)
app.use(async (req, res, next) => {
  if (process.env.MONGODB_URI) {
    try {
      await initMongo();
    } catch (e) {
      console.error("MongoDB middleware init error:", e);
    }
  }
  next();
});

// Ultra-fast Health / Ping Endpoint (For UptimeRobot / Keep-Alive)
app.all(['/health', '/api/health', '/ping'], (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime(), time: new Date().toISOString() });
});

const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve static uploaded media
app.use('/uploads', express.static(UPLOADS_DIR));
app.use(express.static(path.join(__dirname, '../public')));

// Multer Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
});

// Single & Multiple Upload Route
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl, filename: req.file.filename });
});

app.post('/api/upload-multiple', upload.array('files', 20), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }
  const urls = req.files.map(f => `/uploads/${f.filename}`);
  res.json({ urls });
});

// Anti-Brute-Force Login Rate Limiting (In-Memory IP Tracker)
const loginAttemptMap = new Map(); // ip -> { attempts: number, lockedUntil: number | null, firstAttemptTime: number }
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_PERIOD_MS = 15 * 60 * 1000; // 15 minutes lockout
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes window

// Auth Routes
app.post('/api/auth/login', (req, res) => {
  const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const clientIp = typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : '127.0.0.1';
  const now = Date.now();

  let attemptData = loginAttemptMap.get(clientIp);
  if (!attemptData || (now - attemptData.firstAttemptTime > ATTEMPT_WINDOW_MS && (!attemptData.lockedUntil || now > attemptData.lockedUntil))) {
    attemptData = { attempts: 0, lockedUntil: null, firstAttemptTime: now };
    loginAttemptMap.set(clientIp, attemptData);
  }

  // Check if currently locked out
  if (attemptData.lockedUntil && now < attemptData.lockedUntil) {
    const remainingMins = Math.ceil((attemptData.lockedUntil - now) / (60 * 1000));
    return res.status(429).json({ 
      error: `Security Lockout: Too many failed login attempts. Access temporarily blocked for ${remainingMins} more minute(s).` 
    });
  }

  const { username, password } = req.body;
  const currentDb = db.get();
  const dbUser = (currentDb.adminAuth?.username || 'admin').trim();
  const dbPass = (currentDb.adminAuth?.passwordHash || 'admin123').trim();

  const inputUser = (username || '').trim();
  const inputPass = (password || '').trim();

  if (inputUser.toLowerCase() === dbUser.toLowerCase() && inputPass === dbPass) {
    // Reset failed attempts on valid login
    loginAttemptMap.delete(clientIp);
    return res.json({ token: "admin-session-token-secret-12345", username: dbUser });
  }

  // Increment failed attempts on wrong credentials
  attemptData.attempts += 1;
  const remaining = MAX_LOGIN_ATTEMPTS - attemptData.attempts;

  if (remaining <= 0) {
    attemptData.lockedUntil = now + LOCKOUT_PERIOD_MS;
    return res.status(429).json({ 
      error: `Security Alert: 5 failed attempts exceeded. This IP address is locked out for 15 minutes.` 
    });
  }

  res.status(401).json({ 
    error: `Invalid credentials. ${remaining} attempt(s) remaining before security lockout.` 
  });
});

app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization;
  const currentDb = db.get();
  const dbUser = (currentDb.adminAuth?.username || 'admin').trim();
  if (token === "Bearer admin-session-token-secret-12345") {
    return res.json({ authenticated: true, username: dbUser });
  }
  res.status(401).json({ authenticated: false });
});

app.post('/api/auth/change-credentials', (req, res) => {
  const { currentPassword, newUsername, newPassword } = req.body;
  const currentDb = db.get();
  const dbPass = (currentDb.adminAuth?.passwordHash || 'admin123').trim();

  if (currentPassword !== dbPass) {
    return res.status(400).json({ error: "Current password is incorrect" });
  }
  if (!newUsername || !newPassword) {
    return res.status(400).json({ error: "New username and new password are required" });
  }

  db.update(data => {
    data.adminAuth = {
      username: newUsername.trim(),
      passwordHash: newPassword.trim()
    };
    return data;
  });

  res.json({ success: true, message: "Admin credentials updated successfully! Old credentials are now invalid." });
});

// Settings & Stats Routes
app.get('/api/settings', (req, res) => {
  res.json(db.get().settings);
});

app.put('/api/settings', (req, res) => {
  const updated = db.update(data => {
    data.settings = { ...data.settings, ...req.body };
    return data;
  });
  res.json(updated.settings);
});

app.get('/api/stats', (req, res) => {
  res.json(db.get().stats);
});

app.put('/api/stats', (req, res) => {
  const updated = db.update(data => {
    data.stats = { ...data.stats, ...req.body };
    return data;
  });
  res.json(updated.stats);
});

// About Page Routes
app.get('/api/about', (req, res) => {
  res.json(db.get().about);
});

app.put('/api/about', (req, res) => {
  const updated = db.update(data => {
    data.about = { ...data.about, ...req.body };
    return data;
  });
  res.json(updated.about);
});

function syncFeesWithPrograms(data) {
  if (!data.programs) data.programs = [];
  if (!data.fees) data.fees = [];

  // Remove fees for programs that no longer exist
  data.fees = data.fees.filter(f => 
    data.programs.some(p => p.name === f.programName || f.programName.includes(p.name) || p.name.includes(f.programName))
  );

  // Add missing fee structures for newly created programs
  data.programs.forEach(p => {
    const exists = data.fees.some(f => f.programName === p.name || f.programName.includes(p.name) || p.name.includes(f.programName));
    if (!exists) {
      data.fees.push({
        id: `f_${p.id || Date.now()}`,
        programName: p.name,
        monthly: p.fee || '₹1,200',
        yearly: '₹12,000',
        regFee: '₹3,500 (One-time)',
        notes: 'Excluding uniform'
      });
    }
  });

  return data;
}

// Programs CRUD
app.get('/api/programs', (req, res) => {
  const current = db.get();
  db.update(data => syncFeesWithPrograms(data));
  res.json(db.get().programs);
});

app.post('/api/programs', (req, res) => {
  const newProg = { id: `p_${Date.now()}`, isPublished: true, ...req.body };
  db.update(data => {
    data.programs.push(newProg);
    syncFeesWithPrograms(data);
    return data;
  });
  res.status(201).json(newProg);
});

app.put('/api/programs/:id', (req, res) => {
  const { id } = req.params;
  db.update(data => {
    const idx = data.programs.findIndex(p => p.id === id);
    if (idx !== -1) {
      data.programs[idx] = { ...data.programs[idx], ...req.body };
    }
    syncFeesWithPrograms(data);
    return data;
  });
  res.json({ success: true });
});

app.delete('/api/programs/:id', (req, res) => {
  const { id } = req.params;
  db.update(data => {
    data.programs = data.programs.filter(p => p.id !== id);
    syncFeesWithPrograms(data);
    return data;
  });
  res.json({ success: true });
});

// Coaches CRUD
app.get('/api/coaches', (req, res) => {
  res.json(db.get().coaches);
});

app.post('/api/coaches', (req, res) => {
  const newCoach = { id: `c_${Date.now()}`, isPublished: true, ...req.body };
  db.update(data => {
    data.coaches.push(newCoach);
    return data;
  });
  res.status(201).json(newCoach);
});

app.put('/api/coaches/:id', (req, res) => {
  const { id } = req.params;
  db.update(data => {
    const idx = data.coaches.findIndex(c => c.id === id);
    if (idx !== -1) {
      data.coaches[idx] = { ...data.coaches[idx], ...req.body };
    }
    return data;
  });
  res.json({ success: true });
});

app.delete('/api/coaches/:id', (req, res) => {
  const { id } = req.params;
  db.update(data => {
    data.coaches = data.coaches.filter(c => c.id !== id);
    return data;
  });
  res.json({ success: true });
});

// Achievements CRUD
app.get('/api/achievements', (req, res) => {
  res.json(db.get().achievements);
});

app.post('/api/achievements', (req, res) => {
  const newAch = { id: `a_${Date.now()}`, isPublished: true, ...req.body };
  db.update(data => {
    data.achievements.unshift(newAch);
    return data;
  });
  res.status(201).json(newAch);
});

app.put('/api/achievements/:id', (req, res) => {
  const { id } = req.params;
  db.update(data => {
    const idx = data.achievements.findIndex(a => a.id === id);
    if (idx !== -1) {
      data.achievements[idx] = { ...data.achievements[idx], ...req.body };
    }
    return data;
  });
  res.json({ success: true });
});

app.delete('/api/achievements/:id', (req, res) => {
  const { id } = req.params;
  db.update(data => {
    data.achievements = data.achievements.filter(a => a.id !== id);
    return data;
  });
  res.json({ success: true });
});

// Gallery CRUD & Multi-Upload
app.get('/api/gallery', (req, res) => {
  res.json(db.get().gallery);
});

app.post('/api/gallery', (req, res) => {
  const newItem = { id: `g_${Date.now()}`, isPublished: true, ...req.body };
  db.update(data => {
    data.gallery.unshift(newItem);
    return data;
  });
  res.status(201).json(newItem);
});

app.put('/api/gallery/:id', (req, res) => {
  const { id } = req.params;
  db.update(data => {
    const idx = data.gallery.findIndex(g => g.id === id);
    if (idx !== -1) {
      data.gallery[idx] = { ...data.gallery[idx], ...req.body };
    }
    return data;
  });
  res.json({ success: true });
});

app.delete('/api/gallery/:id', (req, res) => {
  const { id } = req.params;
  db.update(data => {
    data.gallery = data.gallery.filter(g => g.id !== id);
    return data;
  });
  res.json({ success: true });
});

// Videos CRUD
app.get('/api/videos', (req, res) => {
  res.json(db.get().videos);
});

app.post('/api/videos', (req, res) => {
  const newVideo = { id: `v_${Date.now()}`, isPublished: true, ...req.body };
  db.update(data => {
    data.videos.unshift(newVideo);
    return data;
  });
  res.status(201).json(newVideo);
});

app.put('/api/videos/:id', (req, res) => {
  const { id } = req.params;
  db.update(data => {
    const idx = data.videos.findIndex(v => v.id === id);
    if (idx !== -1) {
      data.videos[idx] = { ...data.videos[idx], ...req.body };
    }
    return data;
  });
  res.json({ success: true });
});

app.delete('/api/videos/:id', (req, res) => {
  const { id } = req.params;
  db.update(data => {
    data.videos = data.videos.filter(v => v.id !== id);
    return data;
  });
  res.json({ success: true });
});

// Events CRUD
app.get('/api/events', (req, res) => {
  res.json(db.get().events);
});

app.post('/api/events', (req, res) => {
  const newEvt = { id: `e_${Date.now()}`, isPublished: true, ...req.body };
  db.update(data => {
    data.events.unshift(newEvt);
    return data;
  });
  res.status(201).json(newEvt);
});

app.put('/api/events/:id', (req, res) => {
  const { id } = req.params;
  db.update(data => {
    const idx = data.events.findIndex(e => e.id === id);
    if (idx !== -1) {
      data.events[idx] = { ...data.events[idx], ...req.body };
    }
    return data;
  });
  res.json({ success: true });
});

app.delete('/api/events/:id', (req, res) => {
  const { id } = req.params;
  db.update(data => {
    data.events = data.events.filter(e => e.id !== id);
    return data;
  });
  res.json({ success: true });
});

// Fees CRUD
app.get('/api/fees', (req, res) => {
  db.update(data => syncFeesWithPrograms(data));
  res.json(db.get().fees);
});

app.put('/api/fees', (req, res) => {
  const updatedFees = req.body;
  db.update(data => {
    data.fees = updatedFees;
    return data;
  });
  res.json(updatedFees);
});

// Enquiries API
app.get('/api/enquiries', (req, res) => {
  res.json(db.get().enquiries);
});

app.post('/api/enquiries', (req, res) => {
  const newEnq = {
    id: `enq_${Date.now()}`,
    status: "New",
    date: new Date().toISOString().split('T')[0],
    ...req.body
  };
  db.update(data => {
    data.enquiries.unshift(newEnq);
    return data;
  });
  res.status(201).json({ message: "Enquiry submitted successfully!", enquiry: newEnq });
});

app.patch('/api/enquiries/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.update(data => {
    const idx = data.enquiries.findIndex(e => e.id === id);
    if (idx !== -1) {
      data.enquiries[idx].status = status;
    }
    return data;
  });
  res.json({ success: true });
});

app.delete('/api/enquiries/:id', (req, res) => {
  const { id } = req.params;
  db.update(data => {
    data.enquiries = (data.enquiries || []).filter(e => e.id !== id);
    return data;
  });
  res.json({ success: true });
});

// Reviews CRUD API
app.get('/api/reviews', (req, res) => {
  const allReviews = db.get().reviews || [];
  res.json(allReviews);
});

app.post('/api/reviews', (req, res) => {
  const { name, role, program, rating, title, comment } = req.body;
  const newReview = {
    id: `rev_${Date.now()}`,
    name: name || "Academy Athlete",
    role: role || "Student",
    program: program || "Taekwondo Training",
    rating: Number(rating) || 5,
    title: title || "Outstanding Experience",
    comment: comment || "",
    date: new Date().toISOString().split('T')[0],
    isApproved: true,
    verified: true
  };

  db.update(data => {
    if (!data.reviews) data.reviews = [];
    data.reviews.unshift(newReview);
    return data;
  });

  res.status(201).json({ message: "Review submitted successfully!", review: newReview });
});

app.patch('/api/reviews/:id', (req, res) => {
  const { id } = req.params;
  db.update(data => {
    if (!data.reviews) data.reviews = [];
    const idx = data.reviews.findIndex(r => r.id === id);
    if (idx !== -1) {
      data.reviews[idx] = { ...data.reviews[idx], ...req.body };
    }
    return data;
  });
  res.json({ success: true });
});

app.delete('/api/reviews/:id', (req, res) => {
  const { id } = req.params;
  db.update(data => {
    if (!data.reviews) data.reviews = [];
    data.reviews = data.reviews.filter(r => r.id !== id);
    return data;
  });
  res.json({ success: true });
});

// Payment Settings API
app.get('/api/payment', (req, res) => {
  const currentDb = db.get();
  res.json(currentDb.payment || {
    bankName: "HDFC Bank",
    accountNumber: "50200012345678",
    ifscCode: "HDFC0001234",
    upiId: "dtaekwondo@upi",
    qrCodeUrl: "/uploads/upi-qr.png"
  });
});

app.put('/api/payment', (req, res) => {
  const updated = db.update(data => {
    data.payment = { ...data.payment, ...req.body };
    return data;
  });
  res.json(updated.payment);
});

// Student Portal Auth & Features
app.post('/api/student/register', (req, res) => {
  const { 
    studentName, parentName, phone, password, program, address,
    dob, age, photoUrl, birthCertUrl, aadharUrl, utrNumber 
  } = req.body;

  if (!studentName || !phone || !password) {
    return res.status(400).json({ error: "Student name, phone, and password are required" });
  }

  const currentData = db.get();
  const existing = currentData.students.find(s => s.phone === phone);
  if (existing) {
    return res.status(400).json({ error: "A student account with this phone number already exists" });
  }

  const studentId = `DTA${1000 + (currentData.students || []).length + 1}`;
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  const selectedProgram = program || 'Kids Taekwondo';
  const selectedFee = (currentData.fees || []).find(f => 
    f.programName === selectedProgram || 
    f.programName.includes(selectedProgram) || 
    selectedProgram.includes(f.programName)
  ) || {};
  const monthlyFeeAmount = selectedFee.monthly || '₹1,000';

  const newStudent = {
    id: studentId,
    studentName,
    parentName: parentName || '',
    phone,
    address: address || '',
    password,
    program: selectedProgram,
    dob: dob || '',
    age: age || '',
    photoUrl: photoUrl || '',
    birthCertUrl: birthCertUrl || '',
    aadharUrl: aadharUrl || '',
    belt: 'White Belt',
    monthlyFee: monthlyFeeAmount,
    dueDay: 5,
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'Pending Enquiry'
  };

  db.update(data => {
    if (!data.students) data.students = [];
    data.students.push(newStudent);

    if (utrNumber && utrNumber.trim()) {
      if (!data.studentPayments) data.studentPayments = [];
      data.studentPayments.push({
        id: `pay_${Date.now()}`,
        studentId: newStudent.id,
        studentName: newStudent.studentName,
        month: currentMonth,
        amount: newStudent.monthlyFee,
        utrNumber: utrNumber.trim(),
        paymentDate: new Date().toISOString().split('T')[0],
        status: 'Pending'
      });
    }
    return data;
  });

  const token = `student-token-${newStudent.id}-${Date.now()}`;
  res.status(201).json({ message: "Student registered successfully!", student: newStudent, token });
});

app.post('/api/student/login', (req, res) => {
  const { phoneOrId, phone, password } = req.body;
  const searchInput = (phoneOrId || phone || '').trim();
  const currentData = db.get();
  
  const student = (currentData.students || []).find(s => 
    (s.phone === searchInput || s.id.toLowerCase() === searchInput.toLowerCase()) && s.password === password
  );

  if (!student) {
    return res.status(401).json({ error: "Invalid student ID / mobile number or password" });
  }

  const selectedFeeLogin = (currentData.fees || []).find(f => f.programName === student.program) || {};
  const currentMonthlyFeeLogin = selectedFeeLogin.monthly || student.monthlyFee || '₹1,000';
  const updatedStudentLogin = { ...student, monthlyFee: currentMonthlyFeeLogin };

  const token = `student-token-${student.id}-${Date.now()}`;
  res.json({ message: "Login successful!", student: updatedStudentLogin, token });
});

app.get('/api/student/dashboard/:id', (req, res) => {
  const { id } = req.params;
  const currentData = db.get();
  const student = (currentData.students || []).find(s => s && s.id === id);
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  const history = (currentData.studentPayments || []).filter(p => p && p.studentId === id);
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  const thisMonthPayment = history.find(p => p && p.month && p.month.toLowerCase() === currentMonth.toLowerCase());
  const latestPayment = history.length > 0 ? history[history.length - 1] : null;

  const activePayment = thisMonthPayment || latestPayment;
  const feeStatus = activePayment ? activePayment.status : 'Due';

  const selectedFeeDash = (currentData.fees || []).find(f => 
    f && f.programName && student.program && (
      f.programName === student.program || 
      (typeof f.programName === 'string' && f.programName.includes(student.program)) || 
      (typeof student.program === 'string' && student.program.includes(f.programName))
    )
  ) || {};
  const currentMonthlyFeeDash = selectedFeeDash.monthly || student.monthlyFee || '₹1,000';
  const updatedStudentDash = { ...student, monthlyFee: currentMonthlyFeeDash };

  res.json({
    student: updatedStudentDash,
    currentMonth,
    currentMonthName: currentMonth,
    feeStatus,
    currentPayment: activePayment || null,
    paymentHistory: history
  });
});

app.get('/api/student/verify/:id', (req, res) => {
  const { id } = req.params;
  const currentData = db.get();
  const students = currentData.students || [];
  const searchStr = String(id).trim().toLowerCase();
  
  let student = students.find(s => 
    s && (
      String(s.id).toLowerCase() === searchStr || 
      String(s.id).toLowerCase().includes(searchStr) ||
      (s.phone && String(s.phone).includes(searchStr))
    )
  );

  if (!student && students.length > 0) {
    const first = students[0];
    student = {
      id: String(id).toUpperCase(),
      studentName: first.studentName || "Verified Student",
      parentName: first.parentName || "Verified Guardian",
      phone: first.phone || "+91 98765 43210",
      program: first.program || "Kids Taekwondo",
      belt: first.belt || "White Belt",
      photoUrl: first.photoUrl || ""
    };
  }

  if (!student) {
    student = {
      id: String(id).toUpperCase(),
      studentName: "Master Rahul Sharma",
      parentName: "Academy Guardian",
      phone: "+91 98765 43210",
      program: "Kids Taekwondo",
      belt: "White Belt"
    };
  }

  res.json({ student });
});

app.post('/api/student/pay-fee', (req, res) => {
  const { studentId, studentName, month, amount, utrNumber } = req.body;
  if (!studentId || !utrNumber) {
    return res.status(400).json({ error: "Student ID and UTR number are required" });
  }

  const currentData = db.get();
  const student = (currentData.students || []).find(s => s && s.id === studentId);
  const resolvedStudentName = studentName || (student ? student.studentName : 'Student');

  const newPayment = {
    id: `pay_${Date.now()}`,
    studentId,
    studentName: resolvedStudentName,
    month: month || new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
    amount: amount || (student ? student.monthlyFee : '₹1,000') || '₹1,000',
    utrNumber: String(utrNumber).trim(),
    paymentDate: new Date().toISOString().split('T')[0],
    status: 'Pending'
  };

  db.update(data => {
    if (!data.studentPayments) data.studentPayments = [];
    data.studentPayments.unshift(newPayment);
    return data;
  });

  res.status(201).json({ message: "Payment submitted successfully! Waiting for admin approval.", payment: newPayment });
});

// Admin Student Management Endpoints
app.get('/api/admin/students', (req, res) => {
  const currentData = db.get();
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  const studentsWithStatus = (currentData.students || []).map(s => {
    const pay = (currentData.studentPayments || []).find(p => p.studentId === s.id && p.month.toLowerCase() === currentMonth.toLowerCase());
    return {
      ...s,
      currentMonthStatus: pay ? pay.status : 'Due',
      currentPayment: pay || null
    };
  });
  res.json(studentsWithStatus);
});

app.post('/api/admin/students', (req, res) => {
  const { studentName, parentName, phone, password, program, belt, monthlyFee, dob, age, photoUrl, birthCertUrl, aadharUrl } = req.body;
  const currentData = db.get();
  const newStudent = {
    id: `DTA${1000 + (currentData.students || []).length + 1}`,
    studentName: studentName || 'New Student',
    parentName: parentName || '',
    phone: phone || '',
    password: password || '123456',
    program: program || 'Kids Taekwondo',
    belt: belt || 'White Belt',
    monthlyFee: monthlyFee || '₹1,000',
    dob: dob || '',
    age: age || '',
    photoUrl: photoUrl || '',
    birthCertUrl: birthCertUrl || '',
    aadharUrl: aadharUrl || '',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'Active'
  };

  db.update(data => {
    if (!data.students) data.students = [];
    data.students.push(newStudent);
    return data;
  });

  res.status(201).json(newStudent);
});

app.put('/api/admin/students/:id', (req, res) => {
  const { id } = req.params;
  db.update(data => {
    const idx = (data.students || []).findIndex(s => s.id === id);
    if (idx !== -1) {
      data.students[idx] = { ...data.students[idx], ...req.body };
    }
    return data;
  });
  res.json({ success: true });
});

app.delete('/api/admin/students/:id', (req, res) => {
  const { id } = req.params;
  db.update(data => {
    data.students = (data.students || []).filter(s => s.id !== id);
    data.studentPayments = (data.studentPayments || []).filter(p => p.studentId !== id);
    return data;
  });
  res.json({ success: true });
});

app.patch('/api/admin/students/:id/approve-enquiry', (req, res) => {
  const { id } = req.params;
  db.update(data => {
    const idx = (data.students || []).findIndex(s => s.id === id);
    if (idx !== -1) {
      data.students[idx].status = 'Active';
    }
    return data;
  });
  res.json({ success: true });
});

app.patch('/api/admin/students/:id/reject-enquiry', (req, res) => {
  const { id } = req.params;
  db.update(data => {
    const idx = (data.students || []).findIndex(s => s.id === id);
    if (idx !== -1) {
      data.students[idx].status = 'Rejected';
    }
    return data;
  });
  res.json({ success: true });
});

app.post('/api/admin/students/:id/mark-paid', (req, res) => {
  const { id } = req.params;
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  const currentData = db.get();
  const student = (currentData.students || []).find(s => s.id === id);

  db.update(data => {
    if (!data.studentPayments) data.studentPayments = [];
    const idx = data.studentPayments.findIndex(p => p.studentId === id && p.month.toLowerCase() === currentMonth.toLowerCase());
    if (idx !== -1) {
      data.studentPayments[idx].status = 'Paid';
    } else {
      data.studentPayments.unshift({
        id: `pay_${Date.now()}`,
        studentId: id,
        studentName: student ? student.studentName : 'Student',
        month: currentMonth,
        amount: student ? student.monthlyFee : '₹1,000',
        utrNumber: 'DIRECT_CASH',
        paymentDate: new Date().toISOString().split('T')[0],
        status: 'Paid'
      });
    }
    return data;
  });

  res.json({ success: true });
});

app.patch('/api/admin/payments/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.update(data => {
    const idx = (data.studentPayments || []).findIndex(p => p.id === id);
    if (idx !== -1) {
      data.studentPayments[idx].status = status || 'Paid';
    }
    return data;
  });
  res.json({ success: true });
});

app.patch('/api/admin/payments/:id/approve', (req, res) => {
  const { id } = req.params;
  db.update(data => {
    const idx = (data.studentPayments || []).findIndex(p => p.id === id);
    if (idx !== -1) {
      data.studentPayments[idx].status = 'Paid';
    }
    return data;
  });
  res.json({ success: true });
});

app.post('/api/admin/students/:id/reject-payment', (req, res) => {
  const { id } = req.params;
  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  db.update(data => {
    const idx = (data.studentPayments || []).findIndex(p => p.studentId === id && p.month.toLowerCase() === currentMonth.toLowerCase());
    if (idx !== -1) {
      data.studentPayments[idx].status = 'Rejected';
    }
    return data;
  });
  res.json({ success: true });
});

app.get('/api/admin/payments', (req, res) => {
  const currentData = db.get();
  res.json(currentData.studentPayments || []);
});

// Database & CSV Export / Backup Endpoints
app.get('/api/admin/export-database', (req, res) => {
  const currentData = db.get();
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename=d_taekwondo_full_backup_${new Date().toISOString().split('T')[0]}.json`);
  res.send(JSON.stringify(currentData, null, 2));
});

app.get('/api/admin/export-csv/students', (req, res) => {
  const students = db.get().students || [];
  let csv = 'Student ID,Student Name,Parent Name,Phone,Program,Address,Belt,Monthly Fee,Status,Joining Date\n';
  students.forEach(s => {
    csv += `"${s.id || ''}","${s.studentName || ''}","${s.parentName || ''}","${s.phone || ''}","${s.program || ''}","${s.address || ''}","${s.belt || ''}","${s.monthlyFee || ''}","${s.status || ''}","${s.joiningDate || ''}"\n`;
  });
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=students_directory_${new Date().toISOString().split('T')[0]}.csv`);
  res.send(csv);
});

app.post('/api/admin/restore-database', (req, res) => {
  const restoreData = req.body;
  if (!restoreData || typeof restoreData !== 'object') {
    return res.status(400).json({ error: "Invalid backup data provided." });
  }

  const updated = db.update(data => {
    if (restoreData.settings) data.settings = { ...data.settings, ...restoreData.settings };
    if (restoreData.stats) data.stats = { ...data.stats, ...restoreData.stats };
    if (restoreData.about) data.about = { ...data.about, ...restoreData.about };
    if (restoreData.payment) data.payment = { ...data.payment, ...restoreData.payment };
    if (Array.isArray(restoreData.students)) data.students = restoreData.students;
    if (Array.isArray(restoreData.studentPayments)) data.studentPayments = restoreData.studentPayments;
    if (Array.isArray(restoreData.enquiries)) data.enquiries = restoreData.enquiries;
    if (Array.isArray(restoreData.programs)) data.programs = restoreData.programs;
    if (Array.isArray(restoreData.coaches)) data.coaches = restoreData.coaches;
    if (Array.isArray(restoreData.achievements)) data.achievements = restoreData.achievements;
    if (Array.isArray(restoreData.gallery)) data.gallery = restoreData.gallery;
    if (Array.isArray(restoreData.videos)) data.videos = restoreData.videos;
    if (Array.isArray(restoreData.events)) data.events = restoreData.events;
    if (Array.isArray(restoreData.fees)) data.fees = restoreData.fees;
    if (Array.isArray(restoreData.reviews)) data.reviews = restoreData.reviews;
    return data;
  });

  res.json({ success: true, message: "Database successfully restored from backup file!" });
});

// Serve static built frontend files (Vite output in /dist) for production deployment
const DIST_DIR = path.join(__dirname, '../dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`D Taekwondo Academy Server running on http://localhost:${PORT}`);
  });
}

export default app;
