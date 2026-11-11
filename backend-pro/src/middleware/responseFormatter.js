// src/middleware/responseFormatter.js
const responseFormatter = (req, res, next) => {
  const originalJson = res.json.bind(res);

  res.json = (payload) => {
    const success = res.statusCode >= 200 && res.statusCode < 300;

    const formattedResponse = {
      success,
      requestId: req.requestId,
      error: success ? null : payload,
      ...payload, // ✅ spread payload directly, no nested "data"
    };

    return originalJson(formattedResponse);
  };

  next();
};

export default responseFormatter;

/*
🔑 How It Works
Overrides res.json so every response follows the same format.

Success responses → { success: true, data: {...}, error: null, requestId }

Error responses → { success: false, data: null, error: {...}, requestId }

Validation errors, 404s, and server errors all align with this structure.
*/
