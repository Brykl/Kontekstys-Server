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
    const res2 = await pool.query("SELECT * FROM users;");
    console.log("Connected to PostgreSQL. Server time:", res.rows[0].now);
    console.log("SELECT * FROM users:", res2.rows[0]);
  } catch (error) {
    console.error("Failed to connect to PostgreSQL:", error);
  } finally {
    await pool.end();
  }
};

export default pool;
