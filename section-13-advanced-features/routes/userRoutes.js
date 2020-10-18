const express = require('express');
const multer = require('multer');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

const upload = multer({ dest: 'public/img/users/' });

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout);
router.route('/forgotpassword').post(authController.forgotPassword);
router
  .route('/resetpassword/:resetToken')
  .patch(authController.resetPassword);

// run protect middleware
router.use(authController.protect);
router
  .route('/getMe')
  .get(userController.getMe, userController.getUser);

router
  .route('/updateMe')
  .patch(upload.single('photo'), userController.updateMe);
router.route('/deleteMe').delete(userController.deleteMe);
router.route('/updatepassword').patch(authController.updatePassword);

// run restricTo middleware
router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
