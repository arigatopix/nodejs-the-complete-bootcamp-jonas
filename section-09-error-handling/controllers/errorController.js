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

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperatioal) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // Programming or other unknwn error: don't leak error details
    // 1) Log error
    console.error('ERROR :', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Somthing went very wrong!'
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (config.env === 'development') {
    sendErrorDev(err, res);
  } else if (config.env === 'production') {
    // copy err obj.
    let error = { ...err };

    // console.log(err);

    // MongoDB and mongoose Error
    // เมื่อเจออาการ CastError
    if (err.name === 'CastError') error = handleCastErrorDB(err);
    // Duplicate fields
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    // ValidationError
    if (err.name === 'ValidationError') error = handleValidatorErrorDB(err);

    sendErrorProd(error, res);
  }
};
