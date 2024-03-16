const router = require('express').Router();
const fileUpload = require('express-fileupload');
const { uploadResume } = require('../../controllers/uploadController');

const authController = require('../../controllers/api/authController');

router.post('/register', uploadResume, authController.register);

router.post('/signup', fileUpload(), authController.signup);

router.post('/login', fileUpload(), authController.login);

router.post('/forgot-password', fileUpload(), authController.forgotPassword);

router.post('/reset-password', fileUpload(), authController.resetPassword);

module.exports = router;
