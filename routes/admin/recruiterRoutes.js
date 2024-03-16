const router = require('express').Router();

const recController = require('../../controllers/admin/recruiterController');
const { upload } = require('../../controllers/uploadController');

router.get('/recruiter', recController.getRecruiters);
router
  .route('/recruiter/add')
  .get(recController.getAddRecruiters)
  .post(upload.single('image'), recController.postAddRecruiters);
router
  .route('/recruiter/edit/:id')
  .get(recController.getEditRecruiters)
  .post(upload.single('image'), recController.postEditRecruiters);
router.get('/recruiter/delete/:id', recController.getDeleteRecruiters);

module.exports = router;
