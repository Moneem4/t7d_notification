const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.verified = decoded;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        res.status(403).json({
          error: true,
          message: error.message,
          expiredToken: token,
        });
      } else {
        res.status(401).json({
          error: true,
          message: error.message,
        });
      }
    }
  } catch (e) {
    res.status(res.statusCode).json({
      error: true,
      message: e.message,
    });
  }
};
