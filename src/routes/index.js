const express = require("express");
const router = express.Router();
const { authenticateAPIKey } = require("../middlewares");
const controller = require("../controllers");

// Route untuk mengecek status API
router.get("/checkstatus", authenticateAPIKey, controller.checkstatus);

module.exports = router;
