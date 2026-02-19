const User = require("../models/User");

const adminOnly = async (req, res, next) => {
  try {
    console.log("Checking admin access for user ID:", req.user);
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied", status: "error" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error, status: "error" });
  }
};

module.exports = { adminOnly };
