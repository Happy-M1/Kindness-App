// src/middleware/requestId.js
import { v4 as uuidv4 } from "uuid";

const requestIdMiddleware = (req, res, next) => {
  req.requestId = uuidv4(); // generate unique ID
  res.setHeader("X-Request-Id", req.requestId); // expose to client
  next();
};

export default requestIdMiddleware;

/*
✅ End Result
Every request gets a unique ID.

Logs include [RequestID: ...] so you can trace a single request across middleware, controllers, and errors.

Clients also receive the ID in the X-Request-Id header for correlation.

Example log:
*/
