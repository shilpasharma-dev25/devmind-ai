const express = require("express");
const router = express.Router();

const ErrorModel = require("../models/Error");

// POST - Save error
router.post("/", async (req, res) => {
  try {
    const newError = await ErrorModel.create(req.body);

    res.status(201).json({
      success: true,
      data: newError,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// GET - Fetch errors
router.get("/", async (req, res) => {
  try {
    const errors = await ErrorModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: errors.length,
      data: errors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;