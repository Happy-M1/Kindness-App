// src/routes/admin/adminRoutes.js
import express from "express";
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
  getLogs,
  getAuditLogs,
} from "../../controllers/admin/adminController.js";

import {
  getAllActsAdmin,
  deleteActAdmin,
  updateActStatusAdmin,
} from "../../controllers/admin/actAdminController.js";

import adminMiddleware from "../../middleware/adminMiddleware.js";
import { protect } from "../../middleware/authMiddleware.js";

import {
  validateUpdateUserRole,
  validateDeleteUser,
} from "../../middleware/validateAdmin.js";
import validationResultMiddleware from "../../middleware/validationResult.js";

import {
  getAdminGlobalGraph,
  getAdminUserGraph,
} from "../../controllers/admin/rippleController.js";

const router = express.Router();

// Protected admin routes
router.get("/users", protect, adminMiddleware, getAllUsers);
router.get("/logs", protect, adminMiddleware, getLogs);
router.get("/audit-logs", protect, adminMiddleware, getAuditLogs);

router.delete(
  "/users/:id",
  protect,
  adminMiddleware,
  validateDeleteUser,
  validationResultMiddleware,
  deleteUser,
);

router.put(
  "/users/:id/role",
  protect,
  adminMiddleware,
  validateUpdateUserRole,
  validationResultMiddleware,
  updateUserRole,
);

router.get("/acts", protect, adminMiddleware, getAllActsAdmin);
router.delete("/acts/:id", protect, adminMiddleware, deleteActAdmin);
router.put("/acts/:id/status", protect, adminMiddleware, updateActStatusAdmin);

// ✅ Cleaned up admin ripple graph endpoints (no duplicates)
router.get("/ripple/global", protect, adminMiddleware, getAdminGlobalGraph);
router.get("/ripple/user/:userId", protect, adminMiddleware, getAdminUserGraph);

export default router;

/**
 🔑 How It Works
getAllUsers → Admin can view all users (password excluded).

deleteUser → Admin can delete a user by ID.

updateUserRole → Admin can promote/demote users (e.g., user → admin).

Logging → Every action is recorded in AdminLog for accountability.

🔑 How It Works
authMiddleware → verifies JWT, attaches req.user.

adminMiddleware → checks if req.user.role === "admin".

Together → only logged‑in admins can access admin routes.

✅ End Result
Your backend now has a professional admin controller:

Admins can manage users securely.

Actions are logged for transparency.

Routes are protected by adminMiddleware.

✅ End Result
Your backend now has secure authentication middleware:

Every request checks for a valid JWT.

req.user is available in controllers.

Admin routes are fully protected.
 */
