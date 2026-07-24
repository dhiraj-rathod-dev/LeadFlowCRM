const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(err.stack);

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Resource not found' });
  }
  if (err.code === 11000) {
    return res.status(400).json({ error: 'Duplicate field value entered' });
  }
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ error: messages.join(', ') });
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }

  res.status(error.statusCode || 500).json({
    error: error.message || 'Internal Server Error'
  });
};

module.exports = errorHandler;
