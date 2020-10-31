// Set Environment 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'development') {
  const dotenv = require('dotenv');

  const envFile = dotenv.config({ path: './config/config.env' });

  if (envFile.error) {
    throw new Error('Could not find .env file');
  }
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
   * JWT Secret */
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
    cookieExpiresIn: process.env.JWT_COOKIE_EXPIRES_IN,
  },
  /**
   * Send mail */
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM,
    sendgridUsername: process.env.SENDGRID_USERNAME,
    sendgridPassword: process.env.SENDGRID_PASSWORD,
  },
  /**
   * Stripe */
  stripe: {
    secret: process.env.STRIPE_SECRET_KEY,
  },
  /**
   * API configs */
  api: {
    prefix: '/api',
  },
};
