const router = require('express').Router();
const UserController = require('../controllers/UserController');
const authentication = require('../middlewares/authentication');

router.post('/login', UserController.loginUser);
router.post('/register', authentication, UserController.registerUser);
router.get('/list', authentication, UserController.listUser);
router.delete('/delete/:id', authentication, UserController.deleteUser);
router.put('/edit/:id', authentication, UserController.editUser);
router.put('/change-password', authentication, UserController.changePassword);
router.put('/reset-password/:id', UserController.resetPassword);
router.get('/forgot-password/:username', UserController.forgotPassword);
router.get('/list-cuti', authentication, UserController.listCuti);
router.get('/sisa-cuti', authentication, UserController.sisaCuti);

module.exports = router;
