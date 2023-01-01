const router = require('express').Router();
const user = require('./user');
const surat = require('./surat');

router.use('/users', user);
router.use('/surat', surat);

module.exports = router;