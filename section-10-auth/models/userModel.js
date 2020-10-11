const crypto = require('crypto');
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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide'],
    default: 'user',
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
  passwordResetToken: String,
  passwordResetExpires: Date,
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

// update passwordChangedAt field
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || !this.isNew) next();

  this.passwordChangedAt = Date.now() - 1000;
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
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedPasswordTimestamp;
  }
  // default เป็น false คือไม่ได้เปลี่ยน pass หลังจากได้ token
  return false;
};

// Random Reset Password token
userSchema.methods.createPasswordResetToken = function() {
  // สร้าง resetToken ส่งไปทาง email
  const resetToken = crypto.randomBytes(32).toString('hex');

  // encrypt and save to db เพื่อความปลอดภัย และจะจับ match ทีหลัง
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // expires token at
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
module.exports = mongoose.model('User', userSchema);
