const express = require('express');
const router = express.Router();
const { getSignUp } = require('../controllers/signUp');
const { postSignUp } = require('../controllers/signUp');

router.route('/').get(getSignUp);

router.route('/').post(postSignUp);

module.exports = router;
