const express = require("express");
const router = express.Router();

const {
  getWeeklyReport,
} = require("../controllers/reportController");

// Weekly report
router.get("/weekly", getWeeklyReport);

module.exports = router;