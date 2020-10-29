const multer = require('multer');
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

// * Multer middleware
// save to disk
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users/');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];

    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

// filter specific
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError('Not an image! Please upload only images', 400),
      false,
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

// @desc    Get Me
// @route   GET /api/v1/users/getme
// @access  Private
exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

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
  console.log(req.file);
  console.log(req.body);
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
