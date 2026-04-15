const { Pool } = require("pg");
const env = require("../config/env");
const logger = require("../utils/logger");

const pool = new Pool({
  host: env.dbHost,
  port: env.dbPort,
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName
});

/* 🔥 مهم جدًا */
pool.on("connect", () => {
  logger.info("Connected to PostgreSQL");
});

pool.on("error", (err) => {
  logger.error("Unexpected DB error", {
    error: err.message
  });
});

module.exports = pool;