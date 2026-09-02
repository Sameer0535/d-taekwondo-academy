import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultData = {
  "settings": {
    "academyName": "D TAEKWONDO ACADEMY",
    "logoUrl": "/logo.png",
    "heroTitle": "DISCIPLINE. DEDICATION. EXCELLENCE.",
    "heroDescription": "Train with discipline, build confidence and develop the skills to achieve your goals through Taekwondo.",
    "heroBgImage": "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1920&q=80",
    "phone": "+91 94827 97451",
    "whatsapp": "+91 94827 97451",
    "email": "info@dtaekwondoacademy.com",
    "address": "Bengaluru Urban, Karnataka, India",
    "googleMapsUrl": "https://maps.google.com/?q=Bengaluru+Urban",
    "instagram": "https://instagram.com/dtaekwondoacademy",
    "facebook": "https://facebook.com/dtaekwondoacademy",
    "youtube": "https://youtube.com/c/dtaekwondoacademy",
    "footerDescription": "Empowering athletes and martial artists with physical strength, mental discipline, and championship-level Taekwondo training."
  },
  "stats": {
    "yearsExperience": "10+",
    "studentsTrained": "500+",
    "championships": "50+",
    "medalsWon": "100+"
  },
  "about": {
    "mainImage": "/uploads/1786420348761-538858573.jpeg",
    "story": "Founded in 2023, D Taekwondo Academy has grown into a premier Taekwondo training institution committed to excellence, discipline, and holistic athletic development. Over the years, our academy has trained and nurtured hundreds of aspiring athletes, helping them compete and succeed at state, national, and international levels. Beyond competition and medals, we believe Taekwondo is a journey of discipline, confidence, respect, physical fitness, and character development. Our training environment is designed to help every student discover their potential, build resilience, and develop skills that extend far beyond the training hall. At D Taekwondo Academy, we are dedicated to creating confident athletes, disciplined individuals, and stronger communities through the values and spirit of Taekwondo.",
    "mission": "To provide world-class World Taekwondo (WT) training in a disciplined, safe, and motivating environment, transforming passionate learners into confident leaders and champions.",
    "vision": "To become the nation's leading Taekwondo institution, inspiring athletic excellence and producing Olympic-level competitors.",
    "philosophy": "We believe martial arts is more than physical combat—it is a path of self-discovery, respect, perseverance, and indomitable spirit.",
    "whyChooseUs": [
      "Certified Kukkiwon & WTF Master Coaches",
      "State-of-the-Art Training Facility & High-Density Mats",
      "Specialized Competition & Sparring Track",
      "Comprehensive Fitness & Flexibility Conditioning",
      "Structured Belt Progression System",
      "Personalized Attention & Youth Character Building"
    ],
    "facilities": [
      {
        "name": "Shruthika Springs Apartment",
        "image": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"
      },
      {
        "name": "Concorde Spring Meadows Apartment",
        "image": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
      },
      {
        "name": "Wisdom Tree Apartment",
        "image": "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80"
      },
      {
        "name": "SMR Vinay Apartment",
        "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
      }
    ]
  },
  "programs": [
    {
      "id": "p1",
      "name": "Kids Taekwondo Training Program",
      "description": "Designed for young children to build discipline, physical coordination, confidence, focus, and fundamental martial arts movement in a fun, safe environment.",
      "image": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
      "ageGroup": "AGES 5 - 12",
      "days": "Mon, Wed, Fri",
      "time": "4:30 PM - 5:30 PM",
      "duration": "60 mins per session",
      "fee": "₹1,800 / month"
    },
    {
      "id": "p2",
      "name": "Advanced Training Program",
      "description": "Intense regimen for color belt students aiming for Black Belt proficiency, mastering complex kicking combinations, advanced forms, and tactical sparring.",
      "image": "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80",
      "ageGroup": "GREEN BELT & ABOVE",
      "days": "Mon to Fri",
      "time": "6:30 PM - 7:45 PM",
      "duration": "75 mins per session",
      "fee": "₹2,000 / month"
    },
    {
      "id": "p3",
      "name": "Competition Training",
      "description": "Intensive training focused on advanced Kyorugi (Sparring) and Poomsae (Forms) techniques, competition strategies, speed, agility, precision, and fitness. Designed to prepare athletes for state, national, and international-level competitions.",
      "image": "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=800&q=80",
      "ageGroup": "SELECTED ATHLETES",
      "days": "Daily & Weekends",
      "time": "6:00 AM - 8:00 AM",
      "duration": "120 mins per session",
      "fee": "₹2,000 / month"
    },
    {
      "id": "p4",
      "name": "Self Defense Training Program for Women",
      "description": "Practical real-world self-defense techniques, situational awareness, escape tactics, and joint locks for safety and confidence.",
      "image": "https://images.unsplash.com/photo-1564415300397-6a4a15998a69?auto=format&fit=crop&w=800&q=80",
      "ageGroup": "ALL AGES",
      "days": "Sat & Sun",
      "time": "8:00 AM - 9:30 AM",
      "duration": "90 mins per session",
      "fee": "₹800 / month"
    },
    {
      "id": "p5",
      "name": "VR Taekwondo Experience",
      "description": "Experience Taekwondo in an immersive virtual environment, combining modern VR technology with interactive training to make learning engaging, realistic, and exciting.",
      "image": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
      "ageGroup": "18+ YEARS",
      "days": "Mon, Wed, Fri",
      "time": "4:30 PM - 5:30 PM",
      "duration": "60 mins",
      "fee": "₹3,000 / month"
    }
  ],
  "coaches": [
    {
      "id": "c1",
      "name": "DARSHAN A",
      "position": "Head Coach & Founder",
      "beltDan": "1ST DAN BLACK BELT (KUKKIWON)",
      "experience": "15+ Years Experience",
      "certifications": [
        "National Certified Referee",
        "International WT Coach",
        "State Gold Medalist"
      ],
      "bio": "About Me I'm Darshan, the Founder and Head Coach of D Taekwondo Academy. Taekwondo has been a big part of my life, and I'm passionate about sharing what I've learned with the next generation of students. Over the years, I've had the opportunity to train students of different age groups, prepare them for championships and belt examinations, and help them grow both in Taekwondo and in their personal lives. I'm proud to have guided my students to win medals at national-level championships and International level championship. For me, Taekwondo is not just about winning medals. It's about building discipline, confidence, fitness, respect and a strong mindset. Through D Taekwondo Academy, my goal is to create a positive training environment where every student can learn, improve and become the best version of themselves.",
      "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      "displayOrder": 1
    },
    {
      "id": "c2",
      "name": "Sameer R",
      "position": "Coach / Manager",
      "beltDan": "1ST DAN BLACK BELT (KUKKIWON)",
      "experience": "12+ Years Experience",
      "certifications": [
        "Poomsae Specialist Certified",
        "Youth Athletic Trainer"
      ],
      "bio": "Taekwondo has given me the opportunity to compete at both National and International levels, where I have proudly won medals and gained valuable competitive experience. As a Coach, I enjoy sharing what I've learned with younger students and helping them improve their skills, confidence and discipline. I believe every student has the potential to achieve great things with the right training, dedication and mindset. I'm continuously working to improve myself as an athlete and coach while inspiring the next generation of Taekwondo athletes. Expert in technical accuracy, flexibility, and Poomsae form mastery",
      "photo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
      "displayOrder": 2
    }
  ],
  "achievements": [
    {
      "id": "a1",
      "athleteName": "Arjun Kumar",
      "tournamentName": "Karnataka State Taekwondo Championship",
      "tournamentLevel": "State Championship",
      "year": "2026",
      "category": "Junior Kyorugi",
      "weightCategory": "Under 59 KG",
      "medal": "Gold",
      "description": "Secured 1st Place with 4 dominant match wins in the State Championship finals.",
      "image": "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80",
      "isPublished": true
    },
    {
      "id": "a2",
      "athleteName": "Priya Sharma",
      "tournamentName": "National Taekwondo Open Cup",
      "tournamentLevel": "National Championship",
      "year": "2025",
      "category": "Senior Female Kyorugi",
      "weightCategory": "Under 49 KG",
      "medal": "Gold",
      "description": "Awarded Gold Medal and Best Female Athlete of the Tournament.",
      "image": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
      "isPublished": true
    },
    {
      "id": "a3",
      "athleteName": "Rohan Varma",
      "tournamentName": "All India Inter-School Taekwondo Meet",
      "tournamentLevel": "National Championship",
      "year": "2025",
      "category": "Cadet Male",
      "weightCategory": "Under 45 KG",
      "medal": "Silver",
      "description": "Fought fearlessly through 5 rounds to secure National Silver.",
      "image": "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80",
      "isPublished": true
    },
    {
      "id": "a4",
      "athleteName": "D Taekwondo Academy Team",
      "tournamentName": "District Martial Arts Trophy",
      "tournamentLevel": "District Championship",
      "year": "2025",
      "category": "Overall Team Trophy",
      "weightCategory": "N/A",
      "medal": "Award",
      "description": "Crowned Best Overall Academy with 14 Gold, 8 Silver, and 5 Bronze medals.",
      "image": "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=800&q=80",
      "isPublished": true
    },
    {
      "id": "a5",
      "athleteName": "Ananya Patel",
      "tournamentName": "South India Taekwondo Championship",
      "tournamentLevel": "Zonal Championship",
      "year": "2024",
      "category": "Sub-Junior Female",
      "weightCategory": "Under 33 KG",
      "medal": "Bronze",
      "description": "Outstanding performance securing 3rd rank on the podium.",
      "image": "https://images.unsplash.com/photo-1564415300397-6a4a15998a69?auto=format&fit=crop&w=800&q=80",
      "isPublished": true
    }
  ],
  "gallery": [
    {
      "id": "g1",
      "title": "State Championship Finals 2026",
      "description": "Our fighters delivering high-roundhouse kicks in the finals.",
      "category": "TOURNAMENTS",
      "imageUrl": "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80",
      "isPublished": true
    },
    {
      "id": "g2",
      "title": "Morning Agility & Conditioning",
      "description": "Students building endurance and explosive speed.",
      "category": "TRAINING",
      "imageUrl": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
      "isPublished": true
    },
    {
      "id": "g3",
      "title": "Annual Belt Grading Examination",
      "description": "Students demonstrating perfection in Poomsae forms.",
      "category": "BELT EXAMINATIONS",
      "imageUrl": "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80",
      "isPublished": true
    },
    {
      "id": "g4",
      "title": "National Trophy Victory",
      "description": "Celebrating team achievements with coaches and parents.",
      "category": "CHAMPIONSHIPS",
      "imageUrl": "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=800&q=80",
      "isPublished": true
    },
    {
      "id": "g5",
      "title": "Summer Training Intensive Workshop",
      "description": "Masterclass session on electronic scoring defense.",
      "category": "EVENTS",
      "imageUrl": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
      "isPublished": true
    },
    {
      "id": "g6",
      "title": "Youth Sparring Practice",
      "description": "Young martial artists executing targeted pad drills.",
      "category": "ACADEMY LIFE",
      "imageUrl": "https://images.unsplash.com/photo-1564415300397-6a4a15998a69?auto=format&fit=crop&w=800&q=80",
      "isPublished": true
    }
  ],
  "videos": [
    {
      "id": "v1",
      "title": "Highlights: Karnataka State Taekwondo Championship 2026",
      "description": "Watch D Taekwondo Academy athletes dominate the state arena.",
      "youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "category": "Tournaments",
      "isPublished": true
    },
    {
      "id": "v2",
      "title": "Mastering the 360 Tornado Kick - Step by Step",
      "description": "Tutorial by Master John Doe on executing rapid spinning roundhouse kicks.",
      "youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "category": "Training",
      "isPublished": true
    },
    {
      "id": "v3",
      "title": "Annual Belt Grading & Demonstration Ceremony",
      "description": "Inspiring board breaking and high-flying kick demonstrations.",
      "youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "category": "Events",
      "isPublished": true
    }
  ],
  "events": [
    {
      "id": "e1",
      "name": "D Taekwondo Academy Belt Examination 2026",
      "date": "2026-09-06",
      "time": "09:00 AM - 05:00 PM",
      "location": "Koramangala Indoor Stadium",
      "description": "The D Taekwondo Academy Belt Examination is conducted to assess students' progress, technique, discipline, fitness, and understanding of Taekwondo. Each examination marks an important step in the student's martial arts journey and encourages them to continue developing with confidence and dedication",
      "posterUrl": "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80",
      "isPublished": true,
      "fee": "2500"
    },
    {
      "id": "e2",
      "name": "Carpe Diem 3.0 – Interschool Taekwondo Tournament",
      "date": "2026-09-11",
      "time": "07:00 AM - 05:00 PM",
      "location": "BGS National Public School, Hulimavu, Bengaluru",
      "description": "Carpe Diem 3.0 is an Interschool Sports Tournament proudly presented by BGS National Public School, Hulimavu. The event brings together young athletes to compete in various sports, including Taekwondo. It aims to promote sportsmanship, discipline, teamwork, and competitive excellence among school students.",
      "posterUrl": "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=80",
      "isPublished": true,
      "fee": "2500"
    },
    {
      "id": "e3",
      "name": "Bangkok Open KPNP International Taekwondo Championships 2026",
      "date": "2026-11-14",
      "time": "08:00 AM - 06:00 PM",
      "location": "Island Hall, 3rd Floor, Fashion Island Shopping Mall, Bangkok, Thailand",
      "description": "Bangkok Open KPNP International Taekwondo Championships 2026 is an international Taekwondo championship bringing together elite athletes from around the world. The competition features Kyorugi (Individual), Poomsae (Individual, Mix & Team), Poomsae Freestyle, and Speed Kick categories. Inspired by Thailand's rich heritage and the historic Phra Sumen Fort, the championship celebrates excellence, resilience, sportsmanship, and the spirit of Taekwondo.",
      "posterUrl": "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=800&q=80",
      "isPublished": true,
      "fee": "2500"
    }
  ],
  "fees": [
    {
      "id": "f1",
      "programName": "Kids Taekwondo",
      "monthly": "₹1,800",
      "yearly": "₹10,000",
      "regFee": "₹3500 (One-time)",
      "notes": "Excluding uniform"
    },
    {
      "id": "f2",
      "programName": "Advanced Training",
      "monthly": "₹1,800",
      "yearly": "₹15,000",
      "regFee": "₹3500 (One-time)",
      "notes": "Excluding uniform"
    },
    {
      "id": "f3",
      "programName": "Competition Training",
      "monthly": "₹2,000",
      "yearly": "₹12,000",
      "regFee": "₹3,500 (One-time)",
      "notes": "Excluding uniform"
    },
    {
      "id": "f4",
      "programName": "Self Defense",
      "monthly": "₹800",
      "yearly": "₹12,000",
      "regFee": "₹3,500 (One-time)",
      "notes": "Excluding uniform"
    },
    {
      "id": "f5",
      "programName": "VR Taekwondo Experience",
      "monthly": "₹3,000",
      "yearly": "₹12,000",
      "regFee": "₹3,500 (One-time)",
      "notes": "Excluding uniform"
    }
  ],
  "enquiries": [
    {
      "id": "enq_1786556108114",
      "status": "New",
      "date": "2026-08-12",
      "studentName": "rjvkjrv",
      "age": "10",
      "parentName": "",
      "phone": "0987654321",
      "email": "",
      "program": "State Level Open Taekwondo Championship 2026",
      "message": "",
      "utrNumber": ""
    },
    {
      "id": "enq_1786556062035",
      "status": "New",
      "date": "2026-08-12",
      "studentName": "jbekud",
      "age": "10",
      "parentName": "jbee",
      "phone": "0987654321",
      "email": "",
      "program": "State Level Open Taekwondo Championship 2026",
      "message": "",
      "utrNumber": ""
    },
    {
      "id": "enq1",
      "studentName": "Aarav Sharma",
      "age": "10",
      "parentName": "Vikram Sharma",
      "phone": "+91 98123 45678",
      "email": "vikram@example.com",
      "program": "Kids Taekwondo",
      "message": "Looking for beginner trial classes for my son.",
      "status": "Approved",
      "date": "2026-08-08"
    }
  ],
  "adminAuth": {
    "username": "adminnn",
    "passwordHash": "aadminn"
  },
  "students": [
    {
      "id": "STU1001",
      "studentName": "Aarav Sharma",
      "parentName": "Vikram Sharma",
      "phone": "9812345678",
      "password": "password123",
      "program": "Kids Taekwondo",
      "belt": "Yellow Belt",
      "monthlyFee": "₹1,000",
      "dueDay": 5,
      "joiningDate": "2026-01-10",
      "status": "Active"
    },
    {
      "id": "STU1002",
      "studentName": "Test Student",
      "parentName": "Test Parent",
      "phone": "9970509127",
      "password": "password123",
      "program": "Kids Taekwondo",
      "belt": "White Belt",
      "monthlyFee": "₹1,000",
      "dueDay": 5,
      "joiningDate": "2026-08-10",
      "status": "Active"
    },
    {
      "id": "STU1003",
      "studentName": "rohn",
      "parentName": "jdbc",
      "phone": "0987654321",
      "password": "samm",
      "program": "Kids Taekwondo",
      "belt": "White Belt",
      "monthlyFee": "₹1,000",
      "dueDay": 5,
      "joiningDate": "2026-08-11",
      "status": "Active"
    },
    {
      "id": "STU1004",
      "studentName": "dfvr",
      "parentName": "rvc",
      "phone": "09876543265",
      "password": "samm",
      "program": "Kids Taekwondo",
      "belt": "White Belt",
      "monthlyFee": "₹1,000",
      "dueDay": 5,
      "joiningDate": "2026-08-11",
      "status": "Active"
    },
    {
      "id": "STU1005",
      "studentName": "hvut",
      "parentName": "yf75s",
      "phone": "0987654322",
      "password": "samm",
      "program": "Kids Taekwondo",
      "belt": "White Belt",
      "monthlyFee": "₹1,000",
      "dueDay": 5,
      "joiningDate": "2026-08-11",
      "status": "Active"
    },
    {
      "id": "STU1006",
      "studentName": "Aarav Mehta",
      "parentName": "Sanjay Mehta",
      "phone": "9876543210",
      "password": "password123",
      "program": "Kids Taekwondo",
      "belt": "White Belt",
      "monthlyFee": "₹1,000",
      "dueDay": 5,
      "joiningDate": "2026-08-11",
      "status": "Active"
    },
    {
      "id": "STU1007",
      "studentName": "jvyh",
      "parentName": ",jbu",
      "phone": "5648432576",
      "password": "samm",
      "program": "Kids Taekwondo",
      "dob": "2022-03-13",
      "age": "6",
      "photoUrl": "/uploads/1786443621040-402247416.png",
      "birthCertUrl": "",
      "aadharUrl": "",
      "belt": "White Belt",
      "monthlyFee": "₹1,000",
      "dueDay": 5,
      "joiningDate": "2026-08-11",
      "status": "Active"
    }
  ],
  "studentPayments": [
    {
      "id": "pay_1786443630513",
      "studentId": "STU1007",
      "studentName": "jvyh",
      "month": "August 2026",
      "amount": "₹1,000",
      "utrNumber": "098765432112",
      "paymentDate": "2026-08-11",
      "status": "Paid"
    },
    {
      "id": "pay_1786422703438",
      "studentId": "STU1003",
      "studentName": "rohn",
      "month": "August 2026",
      "amount": "₹1,000",
      "utrNumber": "DIRECT_CASH",
      "paymentDate": "2026-08-11",
      "status": "Paid"
    },
    {
      "id": "pay_1786422528042",
      "studentId": "STU1002",
      "studentName": "Test Student",
      "month": "August 2026",
      "amount": "₹1,000",
      "utrNumber": "DIRECT_CASH",
      "paymentDate": "2026-08-11",
      "status": "Paid"
    },
    {
      "id": "pay_1786422071003",
      "studentId": "STU1006",
      "studentName": "Aarav Mehta",
      "month": "August 2026",
      "amount": "₹1,000",
      "utrNumber": "123456789098",
      "paymentDate": "2026-08-11",
      "status": "Paid"
    },
    {
      "id": "pay_1786421589710",
      "studentId": "STU1005",
      "studentName": "hvut",
      "month": "August 2026",
      "amount": "₹1,000",
      "utrNumber": "123456789065",
      "paymentDate": "2026-08-11",
      "status": "Paid"
    },
    {
      "id": "pay_1786421215870",
      "studentId": "STU1004",
      "studentName": "dfvr",
      "month": "August 2026",
      "amount": "₹1,000",
      "utrNumber": "123456789087",
      "paymentDate": "2026-08-11",
      "status": "Paid"
    },
    {
      "id": "pay_1001",
      "studentId": "STU1001",
      "studentName": "Aarav Sharma",
      "month": "August 2026",
      "amount": "₹1,000",
      "utrNumber": "987654321012",
      "paymentDate": "2026-08-05",
      "status": "Paid"
    }
  ],
  "payment": {
    "isEnabled": true,
    "accountName": "DARSHAN A",
    "upiId": "9482797451@kotakbank",
    "qrCodeImage": "/payment-qr.png",
    "paymentNote": "Please mention student name and program while making payment.",
    "bankDetails": {
      "accountHolder": "DARSHAN A",
      "accountNumber": "0047818057",
      "ifscCode": "KKBK0008094",
      "bankName": "Kotak Mahindera Bank"
    },
    "additionalQrCodes": []
  },
  "reviews": [
    {
      "id": "rev_1",
      "name": "Priya Sharma",
      "role": "Parent of Kids Batch Student",
      "program": "Kids Taekwondo Training Program",
      "rating": 5,
      "title": "Incredible transformation in discipline & confidence!",
      "comment": "My 8-year-old son joined D Taekwondo Academy 6 months ago. Master Darshan and Coach Sameer have an exceptional way with children—instilling discipline, focus, and martial arts values with great patience. Highly recommended for parents!",
      "date": "2026-08-20",
      "isApproved": true,
      "verified": true
    },
    {
      "id": "rev_2",
      "name": "Rahul Verma",
      "role": "State Level Athlete",
      "program": "Competition Training",
      "rating": 5,
      "title": "Championship-level coaching and athletic conditioning",
      "comment": "The sparring drills, electronic chest-guard simulation, and athletic conditioning are top-tier. Thanks to the rigorous training under Master Darshan Sir, I secured a Gold Medal at the State Championship this year!",
      "date": "2026-08-15",
      "isApproved": true,
      "verified": true
    },
    {
      "id": "rev_3",
      "name": "Ananya Kulkarni",
      "role": "Self Defense Trainee",
      "program": "Self Defense Training Program for Women",
      "rating": 5,
      "title": "Empowering & practical self-defense techniques",
      "comment": "The weekend women's self-defense sessions have given me so much real-world situational awareness and physical confidence. The escape drills and joint locks taught here are realistic and effective.",
      "date": "2026-08-10",
      "isApproved": true,
      "verified": true
    },
    {
      "id": "rev_4",
      "name": "Karthik Nambiar",
      "role": "Adult Student",
      "program": "Advanced Training Program",
      "rating": 5,
      "title": "Best martial arts dojang in Bengaluru",
      "comment": "As a working professional, attending evening classes has dramatically boosted my stamina, flexibility, and mental discipline. The atmosphere is respectful, motivating, and full of positive energy.",
      "date": "2026-07-28",
      "isApproved": true,
      "verified": true
    },
    {
      "id": "rev_5",
      "name": "Dr. Sneha Hegde",
      "role": "Parent",
      "program": "Kids Taekwondo Training Program",
      "rating": 5,
      "title": "Safe, professional, and world-class instructors",
      "comment": "Both my daughters love attending their Taekwondo sessions. The academy is clean, well-equipped with mats and safety gear, and the coaches hold authentic Kukkiwon Black Belt Dan certifications.",
      "date": "2026-07-14",
      "isApproved": true,
      "verified": true
    },
    {
      "id": "rev_6",
      "name": "Vikas Gowda",
      "role": "Tech Enthusiast & Student",
      "program": "VR Taekwondo Experience",
      "rating": 5,
      "title": "The VR Taekwondo simulation is mind-blowing!",
      "comment": "Combining virtual reality with real martial arts reaction training is truly innovative. It makes reaction training and sparring drills super engaging and fun.",
      "date": "2026-06-30",
      "isApproved": true,
      "verified": true
    }
  ]
};

let inMemoryData = null;

function initInMemoryDb() {
  if (inMemoryData) return inMemoryData;

  const candidates = [
    DB_FILE,
    process.env.PERSISTENT_DATA_PATH,
    path.join('/tmp', 'd_tkd_academy_db_persistent.json')
  ].filter(Boolean);

  // Put defaultData first, so real candidate files override default properties
  const allParsedData = [defaultData];

  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          allParsedData.push(parsed);
        }
      } catch (e) {
        console.error("Error reading candidate DB:", filePath, e);
      }
    }
  }

  // Cumulative Merging across all files & persistent storage
  const mergedSettings = {};
  const mergedStats = {};
  const mergedAbout = {};
  const mergedPayment = {};

  const studentMap = new Map();
  const paymentMap = new Map();
  const enquiryMap = new Map();
  const programMap = new Map();
  const coachMap = new Map();
  const achievementMap = new Map();
  const galleryMap = new Map();
  const videoMap = new Map();
  const eventMap = new Map();
  const feeMap = new Map();
  const reviewMap = new Map();

  // Merge in order (defaultData first, candidate files after so recent entries override defaults)
  for (const data of allParsedData) {
    if (data.settings) Object.assign(mergedSettings, data.settings);
    if (data.stats) Object.assign(mergedStats, data.stats);
    if (data.about) Object.assign(mergedAbout, data.about);
    if (data.payment) Object.assign(mergedPayment, data.payment);

    (data.students || []).forEach(s => {
      if (!s) return;
      const key = s.id || s.phone || JSON.stringify(s);
      studentMap.set(key, { ...(studentMap.get(key) || {}), ...s });
    });

    (data.studentPayments || []).forEach(p => {
      if (!p) return;
      const key = p.id || p.utrNumber || JSON.stringify(p);
      paymentMap.set(key, { ...(paymentMap.get(key) || {}), ...p });
    });

    (data.enquiries || []).forEach(e => {
      if (!e) return;
      const key = e.id || `${e.phone}_${e.date}` || JSON.stringify(e);
      enquiryMap.set(key, { ...(enquiryMap.get(key) || {}), ...e });
    });

    (data.programs || []).forEach(item => {
      if (!item) return;
      const key = item.name ? item.name.toLowerCase().trim() : (item.id || JSON.stringify(item));
      programMap.set(key, { ...(programMap.get(key) || {}), ...item });
    });

    (data.coaches || []).forEach(item => {
      if (!item) return;
      const key = item.name ? item.name.toLowerCase().trim() : (item.id || JSON.stringify(item));
      coachMap.set(key, { ...(coachMap.get(key) || {}), ...item });
    });

    (data.achievements || []).forEach(item => {
      if (!item) return;
      const key = item.id || (item.athleteName + item.tournamentName) || JSON.stringify(item);
      achievementMap.set(key, { ...(achievementMap.get(key) || {}), ...item });
    });

    (data.gallery || []).forEach(item => {
      if (!item) return;
      const key = item.id || item.title || item.imageUrl || JSON.stringify(item);
      galleryMap.set(key, { ...(galleryMap.get(key) || {}), ...item });
    });

    (data.videos || []).forEach(item => {
      if (!item) return;
      const key = item.id || item.youtubeUrl || JSON.stringify(item);
      videoMap.set(key, { ...(videoMap.get(key) || {}), ...item });
    });

    (data.events || []).forEach(item => {
      if (!item) return;
      const key = item.name ? item.name.toLowerCase().trim() : (item.id || JSON.stringify(item));
      eventMap.set(key, { ...(eventMap.get(key) || {}), ...item });
    });

    (data.fees || []).forEach(item => {
      if (!item) return;
      const key = item.programName ? item.programName.toLowerCase().trim() : (item.id || JSON.stringify(item));
      feeMap.set(key, { ...(feeMap.get(key) || {}), ...item });
    });

    (data.reviews || []).forEach(item => {
      if (!item) return;
      const key = item.id || (item.name + item.date) || JSON.stringify(item);
      reviewMap.set(key, { ...(reviewMap.get(key) || {}), ...item });
    });
  }

  inMemoryData = {
    settings: mergedSettings,
    stats: mergedStats,
    about: mergedAbout,
    payment: mergedPayment,
    students: Array.from(studentMap.values()),
    studentPayments: Array.from(paymentMap.values()),
    enquiries: Array.from(enquiryMap.values()),
    programs: Array.from(programMap.values()),
    coaches: Array.from(coachMap.values()),
    achievements: Array.from(achievementMap.values()),
    gallery: Array.from(galleryMap.values()),
    videos: Array.from(videoMap.values()),
    events: Array.from(eventMap.values()),
    fees: Array.from(feeMap.values()),
    reviews: Array.from(reviewMap.values())
  };

  saveInMemoryDb(inMemoryData);
  return inMemoryData;
}

import { MongoClient } from 'mongodb';

let mongoClient = null;
let mongoCollection = null;
let isMongoInitialized = false;

async function initMongo() {
  if (isMongoInitialized) return;
  isMongoInitialized = true;
  const uri = process.env.MONGODB_URI;
  if (!uri) return;

  try {
    mongoClient = new MongoClient(uri);
    await mongoClient.connect();
    const mongoDb = mongoClient.db('d_taekwondo_academy');
    mongoCollection = mongoDb.collection('academy_data');
    console.log('✅ Connected to MongoDB Atlas cloud database!');

    const cloudDoc = await mongoCollection.findOne({ _id: 'main_academy_data' });
    if (cloudDoc && cloudDoc.data) {
      console.log('📦 Loaded existing cloud database from MongoDB Atlas');
      if (inMemoryData) {
        Object.assign(inMemoryData, cloudDoc.data);
      }
    } else {
      if (inMemoryData) {
        await mongoCollection.updateOne(
          { _id: 'main_academy_data' },
          { $set: { _id: 'main_academy_data', data: inMemoryData, updatedAt: new Date().toISOString() } },
          { upsert: true }
        );
        console.log('🌱 Seeded baseline academy data to MongoDB Atlas');
      }
    }
  } catch (err) {
    console.error('⚠️ MongoDB Atlas connection error (running on local fallback):', err.message);
  }
}

initMongo().catch(console.error);

async function syncToMongo(data) {
  if (!mongoCollection) return;
  try {
    await mongoCollection.updateOne(
      { _id: 'main_academy_data' },
      { $set: { _id: 'main_academy_data', data, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );
  } catch (err) {
    console.error('Error syncing to MongoDB:', err.message);
  }
}

function saveInMemoryDb(data) {
  inMemoryData = data;
  data.updatedAt = new Date().toISOString();

  const candidates = [
    DB_FILE,
    process.env.PERSISTENT_DATA_PATH,
    path.join('/tmp', 'd_tkd_academy_db_persistent.json')
  ].filter(Boolean);

  for (const filePath of candidates) {
    try {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error("Error saving DB to candidate:", filePath, e);
    }
  }

  syncToMongo(data).catch(() => {});
}

export const db = {
  get: () => initInMemoryDb(),
  update: (updaterFn) => {
    const current = initInMemoryDb();
    const updated = updaterFn(current);
    saveInMemoryDb(updated);
    return updated;
  }
};
