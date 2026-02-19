const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to protect routes
const protect = (req, res, next) => {
  console.log("Protect middleware called", req.headers.authorization);
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Not authorized", status: "error" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log("Decoded token:", decoded);
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Token is not valid", status: "error" });
  }
};

module.exports = { protect };
