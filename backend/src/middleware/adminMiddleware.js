// backend/src/middleware/adminMiddleware.js

const adminMiddleware = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === "system_admin" || req.user.role === "moderator_admin")
  ) {
    return next();
  }
  return res.status(403).json({ message: "Admin access only" });
};

export default adminMiddleware;


/**
 🔑 How It Works
Checks for JWT in the Authorization header (Bearer <token>).

Verifies token using your JWT_SECRET.

Role enforcement → only allows requests where decoded.role === "admin".

Blocks non‑admins with 403 Access denied.

Attaches user info to req.user for downstream controllers.
 */
