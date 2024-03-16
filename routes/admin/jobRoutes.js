const router = require('express').Router();

const jobController = require('../../controllers/admin/jobController');

router.get('/job', jobController.getJobs);
router
  .route('/job/add')
  .get(jobController.getAddJob)
  .post(jobController.postAddJob);
router.get('/job/:id', jobController.viewJob);
router
  .route('/job/edit/:id')
  .get(jobController.getEditJob)
  .post(jobController.postEditJob);
router.get('/job/delete/:id', jobController.getDeleteJob);
router.post('/updateSwitchState/:jobId', jobController.updateSwitch);

module.exports = router;
