const { Pool } = require("pg");
const env = require("../config/env");

const pool = new Pool({
  host: env.dbHost,
  port: env.dbPort,
  user: env.dbUser,
  password: env.dbPassword,
  database: env.dbName
});

module.exports = pool;