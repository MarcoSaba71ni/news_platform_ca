import "dotenv/config";
import mysql, { Pool } from "mysql2/promise";

// Create MySQL connection pool
const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT), // Make sure this is Railway DB port (26779)
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Quick connection test (logs to Railway deployment logs)
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ DB CONNECTED");
    conn.release();
  } catch (err) {
    console.error("🔥 DB CONNECTION FAILED:", err);
  }
})();

export { pool };