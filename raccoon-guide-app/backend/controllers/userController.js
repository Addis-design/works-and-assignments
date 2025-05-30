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
  exports.getUserFavorites = async (req, res) => {
    try {
      const favorites = await db.all(`
        SELECT 
          links.*,
          users.username,
          users.raccoon_points,
          COALESCE(SUM(ratings.value), 0) AS score
        FROM ratings
        JOIN links ON ratings.link_id = links.id
        JOIN users ON links.user_id = users.id
        WHERE ratings.user_id = ? AND ratings.value = 1
        GROUP BY links.id
        ORDER BY links.created_at DESC
      `, [req.user.id]);
  
      res.json(favorites);
    } catch (error) {
      console.error('Favorites error:', error);
      res.status(500).json({ error: 'Failed to fetch favorites' });
    }
  };