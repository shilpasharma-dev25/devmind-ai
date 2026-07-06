const ErrorModel = require("../models/Error");
const { analyzeError } = require("../services/aiService");
const { getRecommendedResources } = require("../services/n8nService");

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

// Delete Error
const deleteError = async (req, res) => {
  try {
    const error = await ErrorModel.findByIdAndDelete(req.params.id);

    if (!error) {
      return res.status(404).json({
        success: false,
        message: "Error not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Error deleted successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update Error (mark solved or edit)
const updateError = async (req, res) => {
  try {
    const error = await ErrorModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!error) {
      return res.status(404).json({
        success: false,
        message: "Error not found",
      });
    }

    res.status(200).json({
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

// AI Analyze Error
// AI Analyze Error
const analyzeErrorAI = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the error document
    const error = await ErrorModel.findById(id);

    if (!error) {
      return res.status(404).json({
        success: false,
        message: "Error not found",
      });
    }

    // ==========================
    // CACHE CHECK
    // ==========================
    if (
      error.aiAnalysis &&
      error.aiAnalysis.explanation &&
      error.resources.length > 0
    ) {
      console.log("✅ Returning cached AI analysis...");

      return res.status(200).json({
        success: true,
        cached: true,
        data: {
          ...error.aiAnalysis.toObject(),
          resources: error.resources,
        },
      });
    }

    console.log("🤖 Generating fresh AI analysis...");

    // Run Gemini + n8n in parallel
    const [aiResponse, resourceResponse] = await Promise.all([
      analyzeError(error.errorMessage),
      getRecommendedResources(error.errorMessage),
    ]);

    // Save AI analysis
    error.aiAnalysis = {
      explanation: aiResponse.explanation,
      rootCause: aiResponse.rootCause,
      solution: aiResponse.solution,
      bestPractices: aiResponse.bestPractices,
      generatedAt: new Date(),
    };

    // Save resources
    error.resources = resourceResponse.resources || [];

    await error.save();

    return res.status(200).json({
      success: true,
      cached: false,
      data: {
        ...error.aiAnalysis.toObject(),
        resources: error.resources,
      },
    });
  } catch (err) {
    console.error("AI Analysis Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Failed to analyze error.",
    });
  }
};

module.exports = {
  createError,
  getErrors,
  deleteError,
  updateError,
  analyzeErrorAI,
};