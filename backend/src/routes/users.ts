import { Router } from "express";
import { pool } from "../database.js";
import { User, UserResponse } from "../interface.js";
import { validateUserId , validateRequiredUserData } from "../middleware/user-validation.js";
import { authenticateToken } from "../middleware/auth-validation.js";

const router = Router();

/** Error codes that indicate a lost or refused connection — safe to retry. */
const RETRYABLE_CODES = new Set([
  "PROTOCOL_CONNECTION_LOST",
  "ECONNREFUSED",
  "ECONNRESET",
]);

/**
 * Wraps pool.execute() with exponential-backoff retry logic.
 * Only retries on transient connection errors; all other errors are re-thrown
 * immediately.
 */
async function executeWithRetry(
  sql: string,
  params: any[],
  maxRetries = 3,
  initialDelayMs = 500
): Promise<any> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await pool.execute(sql, params);
    } catch (err: any) {
      const isRetryable = err?.code && RETRYABLE_CODES.has(err.code);
      if (!isRetryable || attempt > maxRetries) {
        throw err;
      }
      lastError = err;
      const delay = initialDelayMs * Math.pow(2, attempt - 1);
      console.warn(
        `⚠️  DB query failed (${err.code}), retrying in ${delay}ms… (attempt ${attempt}/${maxRetries})`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw lastError;
}

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a paginated list of users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of users per page
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Server error
 */
router.get("/",  async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [rows] = await executeWithRetry(
      `
      SELECT 
        users.id,
        users.email,
        users.createdAt
      FROM users
      ORDER BY users.createdAt DESC
      LIMIT ? OFFSET ?
      `,
      [limit.toString(), offset.toString()]
    );

    const users = rows as User[];

    res.json({
      page,
      limit,
      results: users.length,
      data: users,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Users could not be fetched",
    });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a single user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/:id", validateUserId , async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const [rows] = await executeWithRetry(
      `SELECT id, email, createdAt FROM users WHERE id = ?`,
      [userId]
    );

    const users = rows as UserResponse[];

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(users[0]);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch user",
    });
  }
});

router.patch("/:id",
  authenticateToken,
  validateUserId,
  // validatePartialUserData
   async (req, res) => {
  const userId = Number(req.params.id);
  const { email , password} = req.body;


  // Check if user is trying to update their own account
  if (req.user!.id !== userId) {
      return res.status(403).json({
        error: "Users can only update their own account",
      });
  }

  const [rows] = await executeWithRetry(`
    SELECT id, email, createdAt FROM users WHERE id = ?`,
    [userId]);

  const users = rows as UserResponse[];
  const user = users[0];
});


export default router;
