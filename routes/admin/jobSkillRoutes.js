const router = require('express').Router();

const skillController = require('../../controllers/admin/jobSkillController');

router.get('/skill', skillController.getSkills);
router
  .route('/skill/add')
  .get(skillController.getAddSkill)
  .post(skillController.postAddSkill);
router
  .route('/skill/edit/:id')
  .get(skillController.getEditSkill)
  .post(skillController.postEditSkill);
router.get('/skill/delete/:id', skillController.getDeleteSkill);

module.exports = router;
