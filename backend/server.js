const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// --- Middleware ---
app.use(cors());                // Enable Cross-Origin requests (for React frontend)
app.use(express.json());        // Parse incoming JSON request bodies

// --- Routes ---
app.use("/api/auth", require("./routes/authRoutes"));   // Auth routes (register/login)
app.use("/api/items", require("./routes/itemRoutes"));   // Item routes (CRUD)

// --- Root Test Route ---
app.get("/", (req, res) => {
  res.json({ message: "Lost & Found API is running 🚀" });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
