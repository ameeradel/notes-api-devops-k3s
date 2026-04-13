const app = require("./app");
const env = require("./config/env");
const logger = require("./utils/logger");

app.listen(env.port, "0.0.0.0", () => {
  logger.info("Server started", {
    port: env.port,
    nodeEnv: env.nodeEnv
  });
});