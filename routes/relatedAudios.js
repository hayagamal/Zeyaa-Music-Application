const express = require("express");
const router = express.Router();
const { postRelatedAudios } = require("../controllers/related-audios");

router.route("/").get(postRelatedAudios);

module.exports = router;
