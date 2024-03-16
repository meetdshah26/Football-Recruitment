const router = require('express').Router();

const categoryController = require('../../controllers/admin/categoryController');

router.get('/category', categoryController.getCategories);
router
  .route('/category/add')
  .get(categoryController.getAddCategory)
  .post(categoryController.postAddCategory);
router
  .route('/category/edit/:id')
  .get(categoryController.getEditCategory)
  .post(categoryController.postEditCategory);
router.get('/category/delete/:id', categoryController.getDeleteCategory);

module.exports = router;
