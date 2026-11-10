// backend/src/utils/logger.js
import fs from "fs";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";

// Only setup local file logging if not in production
let logFile = null;
if (!isProduction) {
  logFile = path.join(process.cwd(), "logs", "app.log");
  if (!fs.existsSync(path.dirname(logFile))) {
    fs.mkdirSync(path.dirname(logFile), { recursive: true });
  }
}

const writeLog = (level, message, requestId = null) => {
  const timestamp = new Date().toISOString();
  const idPart = requestId ? ` [RequestID: ${requestId}]` : "";
  const logMessage = `[${level}] ${timestamp}${idPart} - ${message}`;

  // 1. Write to local file ONLY in development
  if (!isProduction && logFile) {
    try {
      fs.appendFileSync(logFile, logMessage + "\n");
    } catch (err) {
      console.error("Failed to write to log file:", err);
    }
  }

  // 2. Always print to console so Render can capture it in production logs
  if (level === "ERROR") {
    console.error(logMessage);
  } else if (level === "WARN") {
    console.warn(logMessage);
  } else {
    console.log(logMessage);
  }
};

export const logInfo = (message, requestId) => writeLog("INFO", message, requestId);
export const logError = (message, requestId) => writeLog("ERROR", message, requestId);
export const logWarn = (message, requestId) => writeLog("WARN", message, requestId);


