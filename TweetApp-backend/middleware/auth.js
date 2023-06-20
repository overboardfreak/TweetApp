const jwt = require('jsonwebtoken');

const key = process.env.KEY;

const requireAuth = (req, res, next) => {
  const token = req.headers['authorization']
  // check json web token exists or not
  if (token) {
    jwt.verify(token, key, (err) => {
      if (err) {
        res.status(401).json({
          error: 'You are not logged in',
        });
      } else {
        next();
      }
    });
  } else {
    res.status(401).json({
      error: 'You are not logged in',
    });
  }
};

module.exports = { requireAuth };
