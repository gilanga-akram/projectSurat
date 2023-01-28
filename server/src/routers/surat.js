const router = require('express').Router();
const SuratController = require('../controllers/SuratController');
const authentication = require('../middlewares/authentication');
const multer = require("multer");
const storage = require("../helpers/multer");

const upload = multer({ storage: storage });

router.post('/create', authentication, upload.single("image_url"), SuratController.createSurat);
router.get('/single/:suratId', authentication, SuratController.getSingleSurat);
router.get('/all', authentication, SuratController.getAllSurat);
router.put('/change-status/:suratId', authentication, SuratController.changeStatusSurat);
router.delete('/delete/:suratId', authentication, SuratController.deleteSurat);
router.post('/show-surat', authentication, SuratController.showSurat);

module.exports = router;
