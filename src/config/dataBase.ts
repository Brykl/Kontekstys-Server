import { Pool } from "pg";
import config from "./config";

const pool = new Pool({
  host: config.dbHost,
  port: config.dbPort,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
});

export const testConnection = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Connected to PostgreSQL. Server time:", res.rows[0].now);
  } catch (error) {
    console.error("Failed to connect to PostgreSQL:", error);
  }
};

export default pool;
