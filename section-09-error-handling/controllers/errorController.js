const config = require('../config');

const sendErrorDev = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err
  });
};

const sendErrorProd = (res, err) => {
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
    sendErrorDev(res, err);
  } else if (config.env === 'production') {
    sendErrorProd(res, err);
  }
};
