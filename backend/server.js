const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dns = require("dns");

require("dotenv").config();

// DNS Fix
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const errorRoutes = require("./routes/errors");
app.use("/api/errors", errorRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("DevMind AI Backend Running 🚀");
});

// Port
const PORT = process.env.PORT || 5000;

// DB Connection
const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    family: 4,
  });

  console.log("MongoDB connected 🚀");
};

console.log("Gemini Key Exists:", !!process.env.GEMINI_API_KEY);


// Start server AFTER DB connection
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("DB Connection Failed:", error.message);
    process.exit(1);
  }
};

startServer();