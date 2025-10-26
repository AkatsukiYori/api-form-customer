const dotenv = require("dotenv");
const apiKey = process.env.API_KEY;

const authenticateAPIKey = (req, res, next) => {
  const apiKeyHeader = req.header("x-api-key");

  if (!apiKeyHeader) {
    return res.status(401).json({
      success: false,
      message: "API Key required",
    });
  }

  if (apiKeyHeader !== apiKey) {
    return res.status(403).json({
      success: false,
      message: "API Key not valid",
    });
  }

  next();
};

const fromDomain = require("./fromDomain");

module.exports = {
  authenticateAPIKey,
  fromDomain,
};
