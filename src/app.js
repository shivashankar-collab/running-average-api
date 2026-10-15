const express = require("express");

/**
 * Creates the API app with a fresh running average.
 * @returns {import("express").Express}
 */
function createApp() {
  const app = express();
  let numberCount = 0;
  let average = 0;

  app.use(express.json({ strict: false }));

  app.post("/average", (req, res) => {
    const value = typeof req.body === "number" ? req.body : req.body?.number;

    if (typeof value !== "number" || !Number.isFinite(value)) {
      return res.status(400).json({
        error: "Send a finite number, either directly or in a number field."
      });
    }

    numberCount += 1;
    average += (value - average) / numberCount;

    return res.json({ average });
  });

  app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && "body" in error) {
      return res.status(400).json({ error: "Request body must be valid JSON." });
    }
    return next(error);
  });

  return app;
}

module.exports = { createApp };
