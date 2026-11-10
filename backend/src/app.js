// backend/src/app.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoSanitize from "@exortek/express-mongo-sanitize"; // 👈 1. Import sanitization package
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth/authRoutes.js";
import userRoutes from "./routes/user/userRoutes.js";
import adminRoutes from "./routes/admin/adminRoutes.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import { logInfo, logError } from "./utils/logger.js";
import requestLogger from "./middleware/requestLogger.js";
import requestIdMiddleware from "./middleware/requestId.js";
import responseFormatter from "./middleware/responseFormatter.js";

import actRoutes from "./routes/actRoutes.js";
import rippleRoutes from "./routes/rippleRoutes.js";
import inviteRoutes from "./routes/inviteRoutes.js";

import publicRoutes from "./routes/publicRoutes.js";
import siteContentRoutes from "./routes/admin/siteContentRoutes.js";
import testimonialRoutes from "./routes/admin/testimonialRoutes.js";
import contactRoutes from "./routes/admin/contactRoutes.js";

import adminProfileRoutes from "./routes/admin/adminProfileRoutes.js";

import impactStoryRoutes from "./routes/impactStoryRoutes.js";
import adminImpactRoutes from "./routes/adminImpactRoutes.js";

// ✅ Load environment variables
dotenv.config();

const app = express();

// Define a custom token for requestId
morgan.token("id", (req) => req.requestId);

// Example logs
logInfo("Server started on port 5000");
logInfo("MongoDB connected successfully");
logError("Failed to fetch user profile");

// Middleware
app.use(cookieParser());
app.use(requestIdMiddleware);
app.use(express.json());

// ✅ Sanitize data against NoSQL query injection
app.use(mongoSanitize());

// ✅ Environment‑based CORS
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

//app.use(helmet());

// ✅ Enhanced Helmet & Content Security Policy (CSP)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"], // Restricts scripts to your own domain
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"], // Allows inline styles (needed for many UI frameworks) & Google Fonts
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"], // Allows images from self, data URIs, and HTTPS sources (like Cloudinary/avatars)
        connectSrc: ["'self'"], // Restricts API fetch/XHR requests to your own domain
      },
    },
  }),
);

app.use(
  morgan(":id :method :url :status :res[content-length] - :response-time ms"),
);
app.use(requestLogger);
app.use(responseFormatter);

// Routes
// Add this near your other basic routes
app.get("/", (req, res) => {
  res
    .status(200)
    .json({
      status: "success",
      message: "Kindness App Backend is running smoothly!",
    });
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/public", publicRoutes);
app.use("/api/admin/site-content", siteContentRoutes);
app.use("/api/admin/testimonials", testimonialRoutes);
app.use("/api/admin/contacts", contactRoutes);

app.use("/api/acts", actRoutes);
app.use("/api/ripples", rippleRoutes);
app.use("/api/invites", inviteRoutes);

app.use("/api/admin", adminProfileRoutes);

// Mount Impact Story routes
app.use("/api/impact-stories", impactStoryRoutes);
app.use("/api/admin/impact-stories", adminImpactRoutes);

// Handle 404
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;

/**
 Purpose:

Sets up the Express application.

Loads middleware (security, logging, JSON parsing).

Mounts routes (auth, users, admin).

Handles errors globally.
 */

/**
 🔑 Why These Files Are Important
app.js → Keeps your Express setup clean and modular. All middleware and routes are defined here.
 */
