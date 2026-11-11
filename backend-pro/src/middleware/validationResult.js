// src/middleware/validationResult.js
import { validationResult } from "express-validator";
import { logError } from "../utils/logger.js";

const validationResultMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Log validation errors securely
    logError(
      `Validation failed: ${req.method} ${req.originalUrl} - ${JSON.stringify(errors.array())}`,
    );
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export default validationResultMiddleware;

/*
🔑 How It Works
When validation fails (e.g., invalid email, bad role), the error is:

Returned to the client with 400 Bad Request.

Logged in logs/app.log with [ERROR] and timestamp.

✅ End Result
Every failed validation attempt is now captured in logs.

You can audit misuse or bad requests later.

Admin/user actions are fully traceable.
*/
