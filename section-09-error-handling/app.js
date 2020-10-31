const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// Mount Route
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');

// Middleware
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public/`));

if (config.env === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);

// Handling Unhandle Routes
app.all('*', (req, res, next) => {
  // defind error message โดยใช้ built-in Class
  const err = new AppError(`Can't find ${req.originalUrl} on this server`, 404);

  // send to Global Error Handling Middleware
  next(err);
});

// Global Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
