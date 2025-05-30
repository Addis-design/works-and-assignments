const db = require('../config/database');
const { promisify } = require('util');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Convert db.get and db.run to promise-returning functions
const getAsync = promisify(db.get).bind(db);
const runAsync = promisify(db.run).bind(db);

exports.signup = async (req, res) => {
  try {
    console.log('Signup request received:', req.body);
    
    const { username, password } = req.body;

    // Check existing users
    const existingUser = await db.get(
      'SELECT * FROM users WHERE LOWER(username) = ?',
      [username]
    );
    console.log('Existing user check:', existingUser);

    // Updated check to ensure the object has keys (i.e. a user was found)
    if (existingUser && Object.keys(existingUser).length > 0) {
      console.log('Username conflict:', cleanUsername);
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.run(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username, hashedPassword]
    );
    console.log('Insert result:', result);

    res.status(201).json({ 
      message: 'User created successfully',
      id: result.lastID 
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    
    const { username: rawUsername, password } = req.body;
    if (!rawUsername || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    // Normalize username
    const username = rawUsername.trim().toLowerCase();

    // Fetch the user from the database
    const user = await getAsync(
      'SELECT id, username, password_hash, raccoon_points FROM users WHERE LOWER(username) = ?',
      [username]
    );
    
    if (!user) {
      console.error('Database query returned nothing for username:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log('Fetched user from DB:', user);

    // Compare provided password with the stored hash
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      console.log('Invalid password for user:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Ensure JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is missing in environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Login successful:', username);

    res.json({ 
      token,
      username: user.username,
      raccoonPoints: user.raccoon_points || 0
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};
