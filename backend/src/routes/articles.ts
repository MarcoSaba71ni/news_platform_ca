import { Router } from "express";
import { pool } from "../database.js";
import { Article } from "../interface.js";
import { validateUserId } from "../middleware/validation.js";
import { validateCreateArticle } from "../middleware/article-validation.js";
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
 * /articles:
 *   get:
 *     summary: Get a paginated list of articles
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of articles
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [rows] = await executeWithRetry(
      `
      SELECT 
        articles.id,
        articles.title,
        articles.body,
        articles.category,
        articles.createdAt,
        articles.media_url,
        articles.media_alt,
        users.id AS user_id,
        users.email
      FROM articles
      INNER JOIN users ON articles.user_id = users.id
      ORDER BY articles.createdAt DESC
      LIMIT ? OFFSET ?
      `,
      [limit.toString(), offset.toString()]
    );

    const articles = rows as Article[];

    res.json({
      page,
      limit,
      results: articles.length,
      data: articles,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      console.error("MESSAGE:", error.message);
      console.error("STACK:", error.stack);
    }
    
    res.status(500).json({
      error: "Failed to fetch articles",
    });
  }
});

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: Get a single article by ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Article ID
 *     responses:
 *       200:
 *         description: Article found
 *       400:
 *         description: Invalid article ID
 *       404:
 *         description: Article not found
 *       500:
 *         description: Server error
 */
router.get("/:id", validateUserId ,  async (req, res) => {
  try {
    const articleId = Number(req.params.id);

    const [rows] = await executeWithRetry(
      `
      SELECT 
        articles.id,
        articles.title,
        articles.body,
        articles.category,
        articles.createdAt,
        articles.media_url,
        articles.media_alt,
        users.id AS user_id,
        users.email
      FROM articles
      INNER JOIN users ON articles.user_id = users.id
      WHERE articles.id = ?
      `,
      [articleId]
    );

    const articles = rows as Article[];

    if (articles.length === 0) {
      return res.status(404).json({
        error: "Article not found",
      });
    }

    res.json(articles[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch article",
    });
  }
});

router.post("/", authenticateToken, validateCreateArticle, async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const { title, body, category, media_url, media_alt } = req.body;
    const user_id = req.user.id;

    const [result] = await executeWithRetry(
      `INSERT INTO articles (title, body, category, media_url, media_alt, user_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, body, category, media_url, media_alt, user_id]
    );

    const article = {
      id: (result as any).insertId,
      title,
      body,
      category,
      media_url,
      media_alt,
      user_id,
      createdAt: new Date().toISOString(),
    };

    res.status(201).json(article);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create article" });
  }
});


export default router;
