const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('Authorization Header:', authHeader);  // Debug log

  const token = authHeader?.split(' ')[1];
  if (!token) {
    console.log('No token found.');
    return res.status(403).send('Access denied');
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateJWT;
