const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');

const filterObj = (obj, ...allowedFileds) => {
  // obj = req.body = { name: 'j', email: 'ee@gmail.com', role: 'admin'}
  const newObj = {};

  // eslint-disable-next-line array-callback-return
  Object.keys(obj).map(el => {
    if (allowedFileds.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

// @desc    Delete User
// @route   PATCH /api/v1/users/deleteMe
// @access  Private
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    isActive: false,
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// @desc    Update user detail
// @route   PATCH /api/v1/users/updateMe
// @access  Private
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  // ต้องการแยก routes ชัดเจน
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update. Please use /updatepassword',
        404,
      ),
    );
  }

  // 2) Filterd out unwanted fields
  // update เฉพาะ field ที่อนุญาต
  const filterdBody = filterObj(req.body, 'name', 'email');

  // 3) Update user document
  const user = await User.findByIdAndUpdate(
    req.user.id,
    filterdBody,
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private
exports.getAllUsers = factory.getAll(User);

// @desc    Get User
// @route   GET /api/v1/users/:id
// @access  Private/Admin
exports.getUser = factory.getOne(User);

// @desc    Create User
// @route   POST /api/v1/users
// @access  Private/Admin
exports.createUser = factory.createOne(User);

// @desc    Update User by id
// @route   Patch /api/v1/tours/:id
// @access  Private/Admin
exports.updateUser = factory.updateOne(User);

// @desc    Delete User by id
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
exports.deleteUser = factory.deleteOne(User);
