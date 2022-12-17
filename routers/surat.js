const router = require('express').Router();
const SuratController = require('../controllers/SuratController');
const authentication = require('../middlewares/authentication');

router.post('/create', authentication, SuratController.createSurat);

module.exports = router;
