const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const config = require('./config');

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
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`
  });
});

module.exports = app;
