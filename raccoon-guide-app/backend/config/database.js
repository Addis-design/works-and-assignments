const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Get absolute path to database file
const dbPath = path.resolve(__dirname, '../raccoon.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database connection error:', err);
  else console.log('Connected to SQLite database at:', dbPath);
});

module.exports = db;