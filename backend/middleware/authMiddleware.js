const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes — verifies JWT token
const protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user data to request (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      next(); // Proceed to the next middleware/controller
    } catch (error) {
      console.error("Token verification failed:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

module.exports = { protect };
