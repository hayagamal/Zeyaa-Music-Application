const express = require('express');
const router = express.Router();
const { chooseSong } = require('../controllers/chooseSong');



router.get('/:watch', chooseSong);


module.exports = router;
