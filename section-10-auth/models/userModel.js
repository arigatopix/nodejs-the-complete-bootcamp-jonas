const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, ''],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, ''],
    select: false
  }
});

module.exports = mongoose.model('User', userSchema);
