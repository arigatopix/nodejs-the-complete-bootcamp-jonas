const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');

const config = require('./config');

const app = express();

app.use(bodyParser.json());

app.use(morgan('dev'));

app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);

module.exports = app;
