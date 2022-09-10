const express = require("express");
const router = express.Router();
const { postSubscribe } = require("../controllers/subscribe");

router.route("/").post(postSubscribe);

module.exports = router;
