const express = require('express');
const router = express.Router();

const { getUploads } = require('../controllers/uploadSong');
const { uploadSong } = require('../controllers/uploadSong');

router.route('/').get(getUploads);

router.route('/').post(uploadSong);

module.exports = router;
