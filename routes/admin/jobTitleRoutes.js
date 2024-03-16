const router = require('express').Router();

const titleController = require('../../controllers/admin/jobTitleController');

router.get('/title', titleController.getTitles);
router
  .route('/title/add')
  .get(titleController.getAddTitle)
  .post(titleController.postAddTitle);
router
  .route('/title/edit/:id')
  .get(titleController.getEditTitle)
  .post(titleController.postEditTitle);
router.get('/title/delete/:id', titleController.getDeleteTitle);

module.exports = router;
