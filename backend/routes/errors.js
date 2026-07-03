const express = require("express");
const router = express.Router();

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

module.exports = router;