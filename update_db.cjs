const fs = require('fs');
const path = require('path');

const realDbPath = 'C:/Users/Sameer/d-taekwondo-academy (1)/d-taekwondo-academy/server/data/db.json';
const scratchDbPath = 'c:/Users/Sameer/.gemini/antigravity/scratch/d-taekwondo-academy/server/data/db.json';
const dbJsPath = 'c:/Users/Sameer/.gemini/antigravity/scratch/d-taekwondo-academy/server/db.js';

const realDb = JSON.parse(fs.readFileSync(realDbPath, 'utf8'));
const scratchDb = JSON.parse(fs.readFileSync(scratchDbPath, 'utf8'));

// The only new things in scratchDb were events with fees and new enquiries
realDb.events = scratchDb.events;
realDb.enquiries = scratchDb.enquiries;

// Save db.json
fs.writeFileSync(scratchDbPath, JSON.stringify(realDb, null, 2));
console.log("Updated db.json");

// Now update db.js to match realDb
let dbJsContent = fs.readFileSync(dbJsPath, 'utf8');
const defaultDataRegex = /const defaultData = \{[\s\S]*?\};\n\nfunction readDb/m;
const newDefaultData = `const defaultData = ${JSON.stringify(realDb, null, 2)};\n\nfunction readDb`;
dbJsContent = dbJsContent.replace(defaultDataRegex, newDefaultData);
fs.writeFileSync(dbJsPath, dbJsContent);
console.log("Updated db.js with real data");
