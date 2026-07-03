const express = require("express");
const router = express.Router();

const {
  createError,
  getErrors,
} = require("../controllers/errorController");

router.post("/", createError);
router.get("/", getErrors);

module.exports = router;