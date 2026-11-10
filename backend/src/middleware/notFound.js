// src/middleware/notFound.js
import { logError } from "../utils/logger.js";

const notFound = (req, res, next) => {
  logError(`Route not found: ${req.originalUrl}`, req.requestId);
  res.status(404).json({
    message: "Not Found",
    requestId: req.requestId, // include requestId
  });
};

export default notFound;

/*
🔑 How It Works
If no route matches, notFound creates a 404 error.

That error is passed to errorHandler, which formats the response.

Users see a clean JSON message like:
*/

/*
🔑 How It Works
Every error response now includes a requestId.

Clients can see the ID in the JSON response.

That same ID appears in your logs, so you can trace the exact failing request.
*/
