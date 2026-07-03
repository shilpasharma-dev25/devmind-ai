const mongoose = require("mongoose");

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
        "Other",
      ],
      default: "Other",
    },

    status: {
      type: String,
      enum: ["Pending", "Solved"],
      default: "Pending",
    },

    aiExplanation: {
      type: String,
      default: "",
    },

    aiSolution: {
      type: String,
      default: "",
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