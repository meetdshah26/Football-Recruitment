const router = require('express').Router();

const userController = require('../../controllers/admin/userController');

// user
router.post('/user/export', userController.exportUsers);
router.get('/user', userController.getAllUsers);
router.get('/user/:id', userController.viewUser);
router.get('/user/delete/:id', userController.getDeleteUser);

// message
router.get('/message', userController.getAllMessages);
router.get('/message_view/:id', userController.viewMessages);
router.get('/message/delete/:id', userController.getDeleteMessages);

module.exports = router;
