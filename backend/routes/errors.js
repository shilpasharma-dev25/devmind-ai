const express = require("express");
const router = express.Router();
const { analyzeErrorAI } = require("../controllers/errorController");

const {
  createError,
  getErrors,
  deleteError,
  updateError,
} = require("../controllers/errorController");

// CREATE
router.post("/", createError);

// READ
router.get("/", getErrors);

// UPDATE
router.put("/:id", updateError);

// DELETE
router.delete("/:id", deleteError);



router.post("/:id/analyze", analyzeErrorAI);

module.exports = router;