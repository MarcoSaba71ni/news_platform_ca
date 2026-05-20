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

// Log pool-level connection errors
(pool as any).on("error", (err: NodeJS.ErrnoException) => {
  console.error("🔥 DB POOL ERROR:", err.code, err.message);
});

// Attempt to verify the connection on startup with exponential backoff
const MAX_INIT_ATTEMPTS = 5;
const INIT_RETRY_BASE_MS = 1000;

(async () => {
  for (let attempt = 1; attempt <= MAX_INIT_ATTEMPTS; attempt++) {
    try {
      const conn = await pool.getConnection();
      console.log("✅ DB CONNECTED");
      conn.release();
      return;
    } catch (err) {
      const isLastAttempt = attempt === MAX_INIT_ATTEMPTS;
      console.error(
        `🔥 DB CONNECTION FAILED (attempt ${attempt}/${MAX_INIT_ATTEMPTS}):`,
        err
      );
      if (isLastAttempt) {
        console.error("🔥 All DB connection attempts exhausted at startup.");
        return;
      }
      const delay = INIT_RETRY_BASE_MS * Math.pow(2, attempt - 1);
      console.log(`⏳ Retrying DB connection in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
})();

/**
 * Verifies that the pool can acquire a live connection.
 * Returns true if healthy, false otherwise.
 */
async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    return true;
  } catch {
    return false;
  }
}

export { pool, checkDatabaseHealth };