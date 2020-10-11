const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const config = require('./config');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// Mount Route
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// GLOBAL MIDDLEWARES
// Set sucurity HTTP Headers
app.use(helmet());

// Development Logging
if (config.env === 'development') {
  app.use(morgan('dev'));
}

// Rate limiter 15 นาที / 100 request from same API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message:
    'Too many requests from this IP, please try again in an 15 minutes',
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(bodyParser.json({ limit: '10kb' }));
app.use(express.static(`${__dirname}/public/`));

app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);

// Handling Unhandle Routes
app.all('*', (req, res, next) => {
  // defind error message โดยใช้ built-in Class
  const err = new AppError(
    `Can't find ${req.originalUrl} on this server`,
    404,
  );

  // send to Global Error Handling Middleware
  next(err);
});

// Global Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
