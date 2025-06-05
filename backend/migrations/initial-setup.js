const db = require('../config/database');

db.serialize(() => {
  // Enable foreign key constraints
  db.run("PRAGMA foreign_keys = ON");

  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    raccoon_points INTEGER DEFAULT 0
  )`);

  // Links table
  db.run(`CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

  // Ratings table
  db.run(`CREATE TABLE IF NOT EXISTS ratings (
    user_id INTEGER NOT NULL,
    link_id INTEGER NOT NULL,
    value INTEGER CHECK(value IN (1, -1)) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, link_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(link_id) REFERENCES links(id) ON DELETE CASCADE
  )`);

  // Hidden links table
  db.run(`CREATE TABLE IF NOT EXISTS hidden_links (
    user_id INTEGER NOT NULL,
    link_id INTEGER NOT NULL,
    PRIMARY KEY(user_id, link_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(link_id) REFERENCES links(id) ON DELETE CASCADE
  )`);

  console.log('Database schema initialized');
});