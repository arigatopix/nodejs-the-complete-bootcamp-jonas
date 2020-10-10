const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please provide your confirm password'],
    select: false,
    // This only works on CREATE and SAVE
    validate: {
      validator: function(el) {
        return el === this.password;
      },
      message: 'Password are not the same',
    },
  },
  passwordChangedAt: {
    type: Date,
  },
});

// encrypt password
userSchema.pre('save', async function(next) {
  // Only run this function if password actually run
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// check isMatch password
userSchema.methods.correctPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// check changedPassword after created token
userSchema.methods.changedPasswordAfterCreatedToken = function(
  JWTTimestamp,
) {
  if (this.passwordChangedAt) {
    const changedPasswordTimestamp = parseInt(
      this.passwordChangedAt.getTime(),
      10,
    );

    return JWTTimestamp < changedPasswordTimestamp;
  }
  // default เป็น false คือไม่ได้เปลี่ยน pass หลังจากได้ token
  return false;
};
module.exports = mongoose.model('User', userSchema);
