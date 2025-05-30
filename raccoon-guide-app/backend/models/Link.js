const db = require('../config/database');

class Link {
  static create({ title, description, userId }) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO links (title, description, user_id) VALUES (?, ?, ?)',
        [title, description, userId],
        function(err) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
  }

    static findAll(sortBy = 'recent', page = 1) {
      const order = sortBy === 'top' ? 'score DESC' : 'created_at DESC';
      const limit = 10; // Number of results per page
      const offset = (page - 1) * limit; // Calculate the offset for pagination
  
      return new Promise((resolve, reject) => {
        db.all(`
          SELECT 
            links.*, 
            users.username,
            COALESCE(SUM(ratings.value), 0) AS score
          FROM links
          LEFT JOIN ratings ON links.id = ratings.link_id
          JOIN users ON links.user_id = users.id
          GROUP BY links.id
          ORDER BY ${order}
          LIMIT ? OFFSET ?
        `, [limit, offset], (err, rows) => {
          if (err) {
            console.error('Error fetching links:', err);
            reject(err);
          } else {
            if (rows.length === 0) {
              console.log('No links found.');
            }
            console.log('Links fetched:', rows);
            resolve(rows);
          }
        });
      });
    }
  }
  
  module.exports = Link;
  