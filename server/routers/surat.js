const router = require('express').Router();
const SuratController = require('../controllers/SuratController');
const authentication = require('../middlewares/authentication');

router.post('/create', authentication, SuratController.createSurat);
router.get('/single/:suratId', authentication, SuratController.getSingleSurat);
router.get('/all', authentication, SuratController.getAllSurat);
router.put('/change-status/:suratId', authentication, SuratController.changeStatusSurat);
router.delete('/delete/:suratId', authentication, SuratController.deleteSurat);

module.exports = router;