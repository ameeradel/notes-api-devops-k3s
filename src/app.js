const express = require("express");
const healthRoutes = require("./routes/health.routes");
const notesRoutes = require("./routes/notes.routes");
const metricsRoutes = require("./routes/metrics.routes");
const logger = require("./utils/logger");
const {
  httpRequestsTotal,
  httpRequestDurationSeconds
} = require("./utils/metrics");

const app = express();

app.use(express.json());

// Metrics middleware
app.use((req, res, next) => {
  const ignoredRoutes = ["/metrics", "/health", "/ready"];

  if (ignoredRoutes.includes(req.path)) {
    return next();
  }

  const endTimer = httpRequestDurationSeconds.startTimer();

  res.on("finish", () => {
    // Count only real API traffic
    if (!req.path.startsWith("/api")) return;

    // Ignore bot scans / unknown routes
    if (res.statusCode === 404) return;

    const route = req.route?.path || req.path;

    httpRequestsTotal.inc({
      method: req.method,
      route,
      status: res.statusCode
    });

    endTimer({
      method: req.method,
      route,
      status: res.statusCode
    });
  });

  next();
});

// Logger middleware
app.use((req, res, next) => {
  logger.info("Incoming request", {
    method: req.method,
    path: req.path
  });

  next();
});

app.use(healthRoutes);
app.use(metricsRoutes);
app.use("/api", notesRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

module.exports = app;