// src/models/auth/Token.js
import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    refreshToken: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

const Token = mongoose.model("Token", tokenSchema);

export default Token;

/**
 🔑 Why This Model Is Important
Stores refresh tokens → allows users to request new access tokens without logging in again.

Links to user → each token is tied to a specific userId.

Expiration → tokens can be set to expire (e.g., 7 days).

Security → lets you revoke refresh tokens if needed (logout, compromised account).

▶️ How It Fits Into Auth Flow
Login → issue both an access token (short‑lived, e.g., 1h) and a refresh token (longer‑lived, e.g., 7d).

Refresh endpoint → user sends refresh token, backend verifies it against Token model, issues new access token.

Logout → delete refresh token from DB.
 */
