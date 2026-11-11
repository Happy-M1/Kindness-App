// src/middleware/userMiddleware.js
import jwt from "jsonwebtoken";

const userMiddleware = (req, res, next) => {
  try {
    // Get token from headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check role (must be user or admin)
    if (decoded.role !== "user" && decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Users only" });
    }

    // Attach user info to request
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default userMiddleware;

/**
 🔑 How It Works
Checks for JWT in the Authorization header.

Verifies token using JWT_SECRET.

Role enforcement → allows user and admin roles, blocks anything else.

Attaches user info to req.user for use in controllers.
 */
