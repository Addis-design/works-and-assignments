// server.js
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'h2u1AD0620PW+xOsefDjzWtJgUnoSI3qHE7WTWNTOVE=';

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Database setup
const db = new sqlite3.Database('./raccoon.db', (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Initialize database tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    raccoon_points INTEGER DEFAULT 0
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS ratings (
    user_id INTEGER NOT NULL,
    link_id INTEGER NOT NULL,
    value INTEGER CHECK(value IN (1, -1)),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, link_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(link_id) REFERENCES links(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS hidden_links (
    user_id INTEGER NOT NULL,
    link_id INTEGER NOT NULL,
    PRIMARY KEY(user_id, link_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(link_id) REFERENCES links(id)
  )`);
});

// Helper function for database queries
const dbGet = (query, params) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (query, params) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const dbRun = (query, params) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const existingUser = await dbGet('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await dbRun(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username, hashedPassword]
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error during signup' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await dbGet('SELECT * FROM users WHERE username = ?', [username]);
    
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.get('/api/links', async (req, res) => {
  try {
    const sortBy = req.query.sort || 'recent';
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 10; // Default to 10 links per page if not specified
    const offset = (page - 1) * limit; // Calculate the offset based on page and limit

    let query = `
      SELECT 
        links.*, 
        users.username,
        COALESCE(SUM(ratings.value), 0) AS score
      FROM links
      LEFT JOIN ratings ON links.id = ratings.link_id
      JOIN users ON links.user_id = users.id
      GROUP BY links.id
    `;

    if (sortBy === 'top') {
      query += ' ORDER BY score DESC';
    } else {
      query += ' ORDER BY links.created_at DESC';
    }

    query += ` LIMIT ? OFFSET ?`; // Add limit and offset to the query

    const links = await dbAll(query, [limit, offset]);
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch links' });
  }
});


app.post('/api/links', authenticate, async (req, res) => {
  console.log('POST /api/links route hit');
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description required' });
    }

    const result = await dbRun(
      'INSERT INTO links (title, description, user_id) VALUES (?, ?, ?)',
      [title, description, req.user.id]
    );

    res.status(201).json({
      id: result.lastID,
      title,
      description,
      user_id: req.user.id
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create link' });
  }
});

app.get('/api/ratings', async (req, res) => {
  try {
    const ratings = await dbAll(`
      SELECT ratings.*, users.username, links.title
      FROM ratings
      JOIN users ON ratings.user_id = users.id
      JOIN links ON ratings.link_id = links.id
    `);

    res.json(ratings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

app.put('/api/links/:id/rate', authenticate, async (req, res) => {
  try {
    const linkId = req.params.id;
    const { value } = req.body;

    // Check if user is rating their own link
    const link = await dbGet('SELECT user_id FROM links WHERE id = ?', [linkId]);
    if (link.user_id === req.user.id) {
      return res.status(400).json({ error: 'Cannot rate your own link' });
    }

    // Update or insert rating
    await dbRun(
      `INSERT OR REPLACE INTO ratings (user_id, link_id, value) 
       VALUES (?, ?, ?)`,
      [req.user.id, linkId, value]
    );

    // Update raccoon points for link owner
    const pointsChange = value === 1 ? 1 : -1;
    await dbRun(
      'UPDATE users SET raccoon_points = raccoon_points + ? WHERE id = ?',
      [pointsChange, link.user_id]
    );

    const updatedLink = await dbGet(`
      SELECT links.*, COALESCE(SUM(ratings.value), 0) AS score
      FROM links
      LEFT JOIN ratings ON links.id = ratings.link_id
      WHERE links.id = ?
      GROUP BY links.id
    `, [linkId]);

    res.json(updatedLink);
  } catch (err) {
    res.status(500).json({ error: 'Failed to rate link' });
  }
});

app.post('/api/links/:id/hide', authenticate, async (req, res) => {
  try {
    await dbRun(
      'INSERT INTO hidden_links (user_id, link_id) VALUES (?, ?)',
      [req.user.id, req.params.id]
    );
    res.json({ message: 'Link hidden successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to hide link' });
  }
});

app.get('/api/users/me/favorites', authenticate, async (req, res) => {
  try {
    const favorites = await dbAll(`
      SELECT links.*, users.username, SUM(ratings.value) AS score
      FROM links
      JOIN ratings ON links.id = ratings.link_id
      JOIN users ON links.user_id = users.id
      WHERE ratings.user_id = ? AND ratings.value = 1
      GROUP BY links.id
    `, [req.user.id]);

    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});