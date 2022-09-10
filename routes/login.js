const express = require('express');
const router = express.Router();
const { getLogin } = require('../controllers/login');
const { postLogin } = require('../controllers/login');

router.route('/').get(getLogin);

router.route('/').post(postLogin);

module.exports = router;
