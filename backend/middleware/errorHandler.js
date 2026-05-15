const isProd = process.env.NODE_ENV === 'production';

function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  console.error('Unhandled error:', {
    message: err.message,
    path: req.path,
    method: req.method,
    ...(isProd ? {} : { stack: err.stack }),
  });

  const status = err.status || err.statusCode || 500;

  res.status(status).json({
    success: false,
    error: isProd ? 'Something went wrong' : err.message,
  });
}

module.exports = errorHandler;
