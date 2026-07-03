const ErrorModel = require("../models/Error");

// Create Error
const createError = async (req, res) => {
  try {
    console.log(req.body);

    const error = await ErrorModel.create(req.body);

    res.status(201).json({
      success: true,
      data: error,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get Errors
const getErrors = async (req, res) => {
  try {
    const errors = await ErrorModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: errors.length,
      data: errors,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createError,
  getErrors,
};