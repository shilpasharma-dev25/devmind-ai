const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dns = require("dns");

require("dotenv").config();

// Fix DNS resolution issue for MongoDB Atlas
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });

    console.log("MongoDB connected 🚀");
    console.log("Database:", mongoose.connection.name);
    console.log("Host:", mongoose.connection.host);
  } catch (error) {
    console.error("MongoDB error:", error.message);
    process.exit(1);
  }
};

// Routes
const errorRoutes = require("./routes/errors");

app.use("/api/errors", errorRoutes);


// Health Check Route
app.get("/", (req, res) => {
  res.send("DevMind AI Backend Running 🚀");
});

// Port
const PORT = process.env.PORT || 5000;

// Start Server Only After DB Connection
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();