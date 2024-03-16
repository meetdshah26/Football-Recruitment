const router = require('express').Router();

const otherController = require('../../controllers/admin/otherController');
const {
  upload,
} = require('../../controllers/uploadController');

// banner
router.get('/banner', otherController.getBanners);
router
  .route('/banner')
  .post(upload.single('image'), otherController.postAddBanner);

// newsletter
router.get('/newsletter', otherController.getNewsletterList);
router.get('/newsletter/export', otherController.getNewsletterExport);

// testimonial
router.get('/testimonial', otherController.getTestimonial);
router
  .route('/testimonial/add')
  .get(otherController.getAddTestimonial)
  .post(upload.single('image'), otherController.postAddTestimonial);
router
  .route('/testimonial/edit/:id')
  .get(otherController.getEditTestimonial)
  .post(upload.single('image'), otherController.postEditTestimonial);
router.get('/testimonial/delete/:id', otherController.getDeleteTestimonial);

module.exports = router;
