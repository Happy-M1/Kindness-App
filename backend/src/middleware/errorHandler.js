// src/middleware/errorHandler.js
import { logError } from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  // Log error with requestId
  logError(`${err.message}`, req.requestId);

  res.status(statusCode).json({
    message: err.message || "Server Error",
    requestId: req.requestId, // include requestId in response
  });
};

export default errorHandler;
