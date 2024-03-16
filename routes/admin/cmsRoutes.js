const router = require('express').Router();

const cmsController = require('../../controllers/admin/cmsController');
const { upload } = require('../../controllers/uploadController');

router
  .route('/whoWeAre')
  .get(cmsController.getWhoWeAre)
  .post(upload.single('image'), cmsController.postWhoWeAre);

router
  .route('/privacy')
  .get(cmsController.getPrivacy)
  .post(upload.single('image'), cmsController.postPrivacy);

router
  .route('/terms')
  .get(cmsController.getTermsCondi)
  .post(upload.single('image'), cmsController.postTermsCondi);

module.exports = router;
