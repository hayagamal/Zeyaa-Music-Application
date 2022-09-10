const express = require('express');
const router = express.Router();

const { getIndex } = require('../controllers/index');


router.route('/').get(getIndex);


module.exports = router;
