const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { env } = require("./config/env");
const securityRoutes = require("./routes/securityRoutes");
const authRoutes = require("./routes/authRoutes");
const publicRoutes = require("./routes/publicRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

function isPrivateNetworkHost(hostname) {
  const normalizedHostname = String(hostname || "").trim().replace(/^\[|\]$/g, "");

  if (
    normalizedHostname === "localhost" ||
    normalizedHostname === "127.0.0.1" ||
    normalizedHostname === "::1"
  ) {
    return true;
  }

  if (/^10\.\d+\.\d+\.\d+$/.test(normalizedHostname)) {
    return true;
  }

  if (/^192\.168\.\d+\.\d+$/.test(normalizedHostname)) {
    return true;
  }

  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(normalizedHostname)) {
    return true;
  }

  if (/^169\.254\.\d+\.\d+$/.test(normalizedHostname)) {
    return true;
  }

  return false;
}

function buildCorsOptions() {
  return {
    origin(origin, callback) {
      if (!origin || env.corsOrigins === "*") {
        return callback(null, true);
      }

      if (Array.isArray(env.corsOrigins) && env.corsOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (env.nodeEnv !== "production") {
        try {
          const { hostname } = new URL(origin);

          if (isPrivateNetworkHost(hostname)) {
            return callback(null, true);
          }
        } catch (error) {
          return callback(error);
        }
      }

      const error = new Error(`CORS not allowed for origin: ${origin}`);
      error.status = 403;
      error.code = "CORS_NOT_ALLOWED";
      error.details = {
        origin,
        allowedOrigins: env.corsOrigins
      };

      return callback(error);
    },
    methods: ["POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
  };
}

function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(
    helmet({
      crossOriginResourcePolicy: false
    })
  );
  app.use(cors(buildCorsOptions()));
  app.use(express.json({ limit: "1mb" }));
  app.use(
    rateLimit({
      windowMs: env.rateLimitWindowMs,
      max: env.rateLimitMax,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        message: "请求过于频繁，请稍后再试。"
      }
    })
  );

  app.use(`${env.apiPrefix}/security`, securityRoutes);
  app.use(`${env.apiPrefix}/auth`, authRoutes);
  app.use(`${env.apiPrefix}/public`, publicRoutes);
  app.use(`${env.apiPrefix}/admin`, adminRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = {
  createApp
};
