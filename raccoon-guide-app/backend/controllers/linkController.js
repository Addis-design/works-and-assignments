const db = require('../config/database');
const { JWT_SECRET } = process.env;
const Link = require('../models/Link');

// Utility function to wrap db.run in a promise
const runDbQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this); // 'this' contains information about the result
      }
    });
  });
};

// Controller to get all links
exports.getAllLinks = async (req, res) => {
  try {
    console.log('Fetching all links...');
    const links = await Link.findAll();  // Call the findAll method from Link model
    console.log('Links found:', links);

    if (links.length === 0) {
      return res.status(404).json({ message: 'No links found' });
    }
    return res.json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    return res.status(500).json({ error: 'Failed to fetch links' });
  }
};

// Controller to create a new link
exports.createLink = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    // Insert new link
    const result = await runDbQuery(
      'INSERT INTO links (title, description, user_id) VALUES (?, ?, ?)',
      [title, description, userId]
    );

    // Get full link data with user info and score
    const newLink = await db.get(`
      SELECT 
        links.*, 
        users.username,
        COALESCE(SUM(ratings.value), 0) AS score
      FROM links
      LEFT JOIN ratings ON links.id = ratings.link_id
      JOIN users ON links.user_id = users.id
      WHERE links.id = ?
      GROUP BY links.id
    `, [result.lastID]);

    res.status(201).json(newLink);
  } catch (error) {
    console.error('Error creating link:', error);
    res.status(500).json({ error: 'Failed to create link' });
  }
};

// Controller to handle rating a link
exports.rateLink = async (req, res) => {
  try {
    const { linkId, value } = req.body;
    const userId = req.user.id;

    // Validate rating value
    if (![1, -1].includes(value)) {
      return res.status(400).json({ error: 'Invalid rating value' });
    }

    // Check if user is rating their own link
    const linkOwner = await db.get(
      'SELECT user_id FROM links WHERE id = ?',
      [linkId]
    );
    
    if (linkOwner.user_id === userId) {
      return res.status(400).json({ error: 'Cannot rate your own link' });
    }

    // Insert or update rating
    await db.run(
      `INSERT OR REPLACE INTO ratings (user_id, link_id, value)
       VALUES (?, ?, ?)`,
      [userId, linkId, value]
    );

    // Update raccoon points
    await db.run(
      'UPDATE users SET raccoon_points = raccoon_points + ? WHERE id = ?',
      [value, linkOwner.user_id]
    );

    // Get updated link data
    const updatedLink = await db.get(`
      SELECT 
        links.*,
        users.username,
        COALESCE(SUM(ratings.value), 0) AS score,
        COUNT(CASE WHEN ratings.value = 1 THEN 1 END) AS upvotes,
        COUNT(CASE WHEN ratings.value = -1 THEN 1 END) AS downvotes
      FROM links
      LEFT JOIN ratings ON links.id = ratings.link_id
      JOIN users ON links.user_id = users.id
      WHERE links.id = ?
      GROUP BY links.id
    `, [linkId]);

    res.json(updatedLink);
  } catch (error) {
    console.error('Rating error:', error);
    res.status(500).json({ error: 'Failed to rate link' });
  }
};
// Controller to hide a link
// exports.hideLink = async (req, res) => {
//   try {
//     const linkId = req.params.id;
//     const userId = req.user.id;

//     // Insert into hidden_links table to track hidden links
//     await runDbQuery(
//       'INSERT INTO hidden_links (user_id, link_id) VALUES (?, ?)',
//       [userId, linkId]
//     );

//     res.json({ message: 'Link hidden successfully' });
//   } catch (error) {
//     console.error('Error hiding link:', error);
//     res.status(500).json({ error: 'Failed to hide link' });
//   }
// };
// controllers/linkController.js
// linkController.js
exports.hideLink = async (req, res) => {
  try {
    const linkId = req.params.id;
    const userId = req.user.id;

    // Check if link exists
    const linkExists = await db.get(
      'SELECT id FROM links WHERE id = ?',
      [linkId]
    );
    
    if (!linkExists) {
      return res.status(404).json({ error: 'Link not found' });
    }

    // Insert into hidden_links
    await db.run(
      `INSERT INTO hidden_links (user_id, link_id)
       VALUES (?, ?)
       ON CONFLICT(user_id, link_id) DO NOTHING`,
      [userId, linkId]
    );

    res.json({ message: 'Link hidden successfully' });

  } catch (error) {
    console.error('Hide link error:', error);
    res.status(500).json({ 
      error: 'Database error. Please try again later.',
      details: error.message 
    });
  }
};
exports.rateLink = async (req, res) => {
  try {
    const { linkId, value } = req.body;
    const userId = req.user.id;

    // Get link owner
    const link = await db.get(
      'SELECT user_id FROM links WHERE id = ?',
      [linkId]
    );

    // Prevent self-rating
    if (link.user_id === userId) {
      return res.status(400).json({ error: "You can't rate your own links" });
    }

    // Get previous rating if exists
    const previousRating = await db.get(
      'SELECT value FROM ratings WHERE user_id = ? AND link_id = ?',
      [userId, linkId]
    );

    // Calculate points change
    let pointsChange = value;
    if (previousRating) {
      pointsChange -= previousRating.value; // Undo previous impact
    }

    // Update points transaction
    await db.run(
      'UPDATE users SET raccoon_points = raccoon_points + ? WHERE id = ?',
      [pointsChange, link.user_id]
    );

    // Update rating
    await db.run(
      `INSERT OR REPLACE INTO ratings (user_id, link_id, value)
       VALUES (?, ?, ?)`,
      [userId, linkId, value]
    );

    // Return updated link data
    const updatedLink = await db.get(`
      SELECT 
        links.*,
        users.username,
        users.raccoon_points,
        COALESCE(SUM(ratings.value), 0) AS score
      FROM links
      LEFT JOIN ratings ON links.id = ratings.link_id
      JOIN users ON links.user_id = users.id
      WHERE links.id = ?
      GROUP BY links.id
    `, [linkId]);

    res.json(updatedLink);
  } catch (error) {
    console.error('Rating error:', error);
    res.status(500).json({ error: 'Failed to process rating' });
  }
};