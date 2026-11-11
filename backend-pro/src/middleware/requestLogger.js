// src/middleware/requestLogger.js
import { logInfo } from "../utils/logger.js";

const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, originalUrl, requestId } = req;
  logInfo(`Incoming request: ${method} ${originalUrl}`, requestId);

  res.on("finish", () => {
    const duration = Date.now() - start;
    logInfo(
      `${req.method} ${req.originalUrl} - ${res.statusCode} [${duration}ms]`,
    );
  });

  next();
};

export default requestLogger;

/**
 🔑 How It Works
Logs every request with:

HTTP method (GET, POST, etc.)

URL (/api/users/profile)

Response status (200, 404, etc.)

Response time in ms

Saves logs to logs/app.log and prints them in console.
 */

/**
 🔑 How It Works
Each request gets a unique requestId (via requestIdMiddleware).

requestLogger logs the method + URL with that ID.

Your controllers also log successes/errors with the same ID.

Now you can trace a single request across middleware, controllers, and logs.
 */

/*
🔑 How It Works
Each request gets a unique requestId from requestIdMiddleware.

Morgan logs now include that ID in every line.

Your custom logInfo/logError also include the same ID.

Together, you can trace a request across access logs and application logs.
*/
