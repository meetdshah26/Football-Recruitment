const router = require('express').Router();
const fileUpload = require('express-fileupload');
const cmsController = require('../../controllers/api/cmsController');

router.get('/whoWeAre', cmsController.getWhoWeAre);

router.get('/privacy', cmsController.getPrivacy);

router
  .route('/contact')
  .post(fileUpload(), cmsController.postContact);

router.post('/newsletter', fileUpload(), cmsController.newsletter);

router.get('/banner', cmsController.getBanners);

router.get('/testimonial', cmsController.getTestimonial);

router.get('/terms', cmsController.getTermsCondition);

module.exports = router;
