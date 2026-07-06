const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    title: String,
    url: String,
    description: String,
    source: String,
  },
  { _id: false }
);

const aiAnalysisSchema = new mongoose.Schema(
  {
    explanation: {
      type: String,
      default: "",
    },

    rootCause: {
      type: [String],
      default: [],
    },

    solution: {
      type: [String],
      default: [],
    },

    bestPractices: {
      type: [String],
      default: [],
    },

    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const errorSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    errorMessage: {
      type: String,
      required: true,
    },

    stack: {
      type: String,
    },

    technology: {
      type: String,
      enum: [
        "React",
        "Node",
        "Express",
        "MongoDB",
        "JavaScript",
        "PHP",
        "WordPress",
        "Shopify",
        "Other",
      ],
      default: "Other",
    },

    status: {
      type: String,
      enum: ["Pending", "Solved"],
      default: "Pending",
    },

    aiAnalysis: {
      type: aiAnalysisSchema,
      default: () => ({}),
    },

    resources: {
      type: [resourceSchema],
      default: [],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Error", errorSchema);