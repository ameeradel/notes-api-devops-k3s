const express = require("express");
const healthRoutes = require("./routes/health.routes");
const notesRoutes = require("./routes/notes.routes");
const logger = require("./utils/logger");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  logger.info("Incoming request", {
    method: req.method,
    path: req.path
  });
  next();
});

app.use(healthRoutes);
app.use("/api", notesRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

module.exports = app;