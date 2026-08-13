import http from 'http';

const BASE_URL = 'http://localhost:5000';

async function request(path, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log("=== STARTING COMPREHENSIVE BACKEND API AUDIT ===\n");
  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`✅ PASSED: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ FAILED: ${name}\n   Error: ${err.stack || err.message}`);
      failed++;
    }
  };

  // 1. Settings
  await test("GET /api/settings", async () => {
    const res = await request('/api/settings');
    if (res.status !== 200 || !res.body || !res.body.academyName) throw new Error(`Status ${res.status}`);
  });

  // 2. Stats
  await test("GET /api/stats", async () => {
    const res = await request('/api/stats');
    if (res.status !== 200 || !res.body) throw new Error(`Status ${res.status}`);
  });

  // 3. About
  await test("GET /api/about", async () => {
    const res = await request('/api/about');
    if (res.status !== 200 || !res.body) throw new Error(`Status ${res.status}`);
  });

  // 4. Programs
  await test("GET /api/programs", async () => {
    const res = await request('/api/programs');
    if (res.status !== 200 || !Array.isArray(res.body)) throw new Error(`Status ${res.status}`);
  });

  // 5. Coaches
  await test("GET /api/coaches", async () => {
    const res = await request('/api/coaches');
    if (res.status !== 200 || !Array.isArray(res.body)) throw new Error(`Status ${res.status}`);
  });

  // 6. Achievements
  await test("GET /api/achievements", async () => {
    const res = await request('/api/achievements');
    if (res.status !== 200 || !Array.isArray(res.body)) throw new Error(`Status ${res.status}`);
  });

  // 7. Gallery
  await test("GET /api/gallery", async () => {
    const res = await request('/api/gallery');
    if (res.status !== 200 || !Array.isArray(res.body)) throw new Error(`Status ${res.status}`);
  });

  // 8. Videos
  await test("GET /api/videos", async () => {
    const res = await request('/api/videos');
    if (res.status !== 200 || !Array.isArray(res.body)) throw new Error(`Status ${res.status}`);
  });

  // 9. Events
  await test("GET /api/events", async () => {
    const res = await request('/api/events');
    if (res.status !== 200 || !Array.isArray(res.body)) throw new Error(`Status ${res.status}`);
  });

  // 10. Fees
  await test("GET /api/fees", async () => {
    const res = await request('/api/fees');
    if (res.status !== 200 || !Array.isArray(res.body)) throw new Error(`Status ${res.status}`);
  });

  // 11. Payment
  await test("GET /api/payment", async () => {
    const res = await request('/api/payment');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  // 12. Enquiries
  await test("GET /api/enquiries", async () => {
    const res = await request('/api/enquiries');
    if (res.status !== 200 || !Array.isArray(res.body)) throw new Error(`Status ${res.status}`);
  });

  // 13. Admin Auth - Login with admin / admin123
  await test("POST /api/auth/login (Valid admin/admin123)", async () => {
    const res = await request('/api/auth/login', 'POST', { username: 'admin', password: 'admin123' });
    if (res.status !== 200 || !res.body.token) throw new Error(`Status ${res.status}`);
  });

  // 14. Admin Auth - Reject invalid login
  await test("POST /api/auth/login (Invalid credentials rejected)", async () => {
    const res = await request('/api/auth/login', 'POST', { username: 'wronguser', password: 'wrongpassword' });
    if (res.status !== 401) throw new Error(`Status ${res.status}`);
  });

  // 15. Student Registration & Login Flow
  let testStudentId = '';
  const testPhone = `99${Date.now().toString().slice(-8)}`;

  await test("POST /api/student/register", async () => {
    const res = await request('/api/student/register', 'POST', {
      studentName: "Test Student",
      parentName: "Test Parent",
      phone: testPhone,
      password: "password123",
      program: "Kids Taekwondo"
    });
    if ((res.status !== 200 && res.status !== 201) || !res.body.student?.id) throw new Error(`Status ${res.status}`);
    testStudentId = res.body.student.id;
  });

  await test("POST /api/student/login", async () => {
    const res = await request('/api/student/login', 'POST', {
      phone: testPhone,
      password: "password123"
    });
    if (res.status !== 200 || !res.body.token) throw new Error(`Status ${res.status}`);
  });

  await test("GET /api/student/dashboard/:id", async () => {
    if (!testStudentId) throw new Error("No student ID available");
    const res = await request(`/api/student/dashboard/${testStudentId}`);
    if (res.status !== 200 || !res.body.student) throw new Error(`Status ${res.status}`);
  });

  // 16. Student Submit Payment UTR
  let paymentId = '';
  await test("POST /api/student/pay-fee", async () => {
    if (!testStudentId) throw new Error("No student ID available");
    const res = await request('/api/student/pay-fee', 'POST', {
      studentId: testStudentId,
      studentName: "Test Student",
      month: "August 2026",
      amount: "₹1,000",
      utrNumber: "987654321999"
    });
    if ((res.status !== 200 && res.status !== 201) || !res.body.payment?.id) throw new Error(`Status ${res.status}`);
    paymentId = res.body.payment.id;
  });

  // 17. Admin Get Students
  await test("GET /api/admin/students", async () => {
    const res = await request('/api/admin/students');
    if (res.status !== 200 || !Array.isArray(res.body)) throw new Error(`Status ${res.status}`);
  });

  // 18. Admin Approve Fee Payment
  await test("PATCH /api/admin/payments/:id/approve", async () => {
    if (!paymentId) throw new Error("No payment ID available");
    const res = await request(`/api/admin/payments/${paymentId}/approve`, 'PATCH');
    if (res.status !== 200 || !res.body.success) throw new Error(`Status ${res.status}`);
  });

  // Clean up test student
  if (testStudentId) {
    await request(`/api/admin/students/${testStudentId}`, 'DELETE');
  }

  console.log(`\n========================================`);
  console.log(`AUDIT RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);
}

runTests();
