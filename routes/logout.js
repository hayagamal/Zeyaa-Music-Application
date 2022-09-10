const express = require('express');
const router = express.Router();
const { getLogout } = require('../controllers/logout');

router.route('/').get(getLogout);

module.exports = router;
