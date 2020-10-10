const dotenv = require('dotenv');

const envFile = dotenv.config({ path: './config/config.env' });

// Set Environment 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (envFile.error) {
  throw new Error('Could not find .env file');
}

module.exports = {
  /**
   * Environment  */
  env: process.env.NODE_ENV,
  /**
   * PORT */
  port: parseInt(process.env.PORT, 10),
  /**
   * MONGODB Connection */
  mongoURI: process.env.MONGO_URI,
  /**
   * API configs */
  api: {
    prefix: '/api'
  }
};
