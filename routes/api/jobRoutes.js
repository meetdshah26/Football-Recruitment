const router = require('express').Router();
const fileUpload = require('express-fileupload');

const { checkUser, isUser } = require('../../controllers/api/authController');
const jobController = require('../../controllers/api/jobController');
const { uploadResume } = require('../../controllers/uploadController');

router.get('/category', jobController.categoryCountryList);
router.get('/all-job', isUser, jobController.getJobList);
router.get('/job/:id', jobController.getJobByID);

router.get('/apply/job', checkUser, jobController.getAppliedJobs);
router.post(
  '/apply/job/:jobId',
  fileUpload(),
  checkUser,
  jobController.applyForJob
);

router.get('/resume', checkUser, jobController.getResume);
router.get('/select/resume/:id', checkUser, jobController.selectResume);
router.route('/resume').post(checkUser, uploadResume, jobController.postResume);
router.delete('/resume/:id', checkUser, jobController.deleteResume);

router.get('/autocomplete/title', jobController.findByTitle);
router.get('/autocomplete/city', jobController.findByCity);

router.get('/all/jobs', jobController.popularJobs);

router.get('/job-title', jobController.getJobTitles);
router.get('/job-skill', jobController.getJobSkills);

module.exports = router;
