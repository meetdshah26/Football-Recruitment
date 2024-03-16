const router = require('express').Router();

const fileUpload = require('express-fileupload');
const { checkUser } = require('../../controllers/api/authController');
const dashboardController = require('../../controllers/api/dashboardController');

router
  .route('/profile')
  .get(checkUser, dashboardController.getProfile)
  .put(fileUpload(), checkUser, dashboardController.editProfile);

router.post(
  '/change-password',
  fileUpload(),
  checkUser,
  dashboardController.changePassword
);

module.exports = router;
