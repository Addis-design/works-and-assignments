const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' }); // Return if no token found
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' }); // Return if token verification fails
    }

    req.user = user; // Attach user data to request object
    next(); // Proceed to the next middleware or route handler
  });
};
