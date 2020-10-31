const config = require('../config');
const AppError = require('../utils/appError');

// Handle MongoDB Error
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = Object.values(err.keyValue).join('. ');
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidatorErrorDB = err => {
  // ดึง message แต่ละ fields
  const error = Object.values(err.errors).map(el => el.message);

  // join value in array
  const message = `Invalid input data ${error.join('. ')}`;

  return new AppError(`${message}`, 400);
};

// Handle JSON Web Token Error
const handleJWTError = () => {
  // join value in array
  const message = `Invalid token. Please log in again`;
  return new AppError(`${message}`, 401);
};

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // A) API ERROR
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }

  // B) RENDERED WEBSITE
  console.error('ERROR :', err);
  return res.status(err.statusCode).render('error', {
    title: 'Somthing went wrong!',
    message: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API ERROR
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperatioal) {
      // Operational, trusted error: send message to client
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // Programming or other unknwn error: don't leak error details
    // 1) Log error
    console.error('ERROR :', err);

    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Somthing went very wrong!',
    });
  }

  // B) RENDERED WEBSITE
  if (err.isOperatioal) {
    // Operational, trusted error: send message to client
    return res.status(err.statusCode).render('error', {
      title: 'Somthing went wrong!',
      message: err.message,
    });
  }

  // Programming or other unknwn error: don't leak error details
  console.error('ERROR :', err);
  return res.status(err.statusCode).render('error', {
    title: 'Somthing went wrong!',
    message: 'Please try again leter.',
  });
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (config.env === 'development') {
    sendErrorDev(err, req, res);
  } else if (config.env === 'production') {
    // copy err obj.
    let error = { ...err };
    // * ทำไมไม่ copy message ไม่รู้เลยต้อง copy
    error.message = err.message;

    // MongoDB and mongoose Error
    // เมื่อเจออาการ CastError
    if (err.name === 'CastError') error = handleCastErrorDB(err);
    // Duplicate fields
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    // ValidationError
    if (err.name === 'ValidationError')
      error = handleValidatorErrorDB(err);

    // JWT error
    if (err.name === 'JsonWebTokenError') error = handleJWTError();

    sendErrorProd(error, req, res);
  }
};
