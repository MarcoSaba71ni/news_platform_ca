import { Router } from "express";
import { pool } from "../database.js";
import { Article } from "../interface.js";

const router = Router();

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

    const [rows] = await pool.execute(
      `
      SELECT 
        articles.id,
        articles.title,
        articles.body,
        articles.category,
        articles.createdAt,
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
router.get("/:id", async (req, res) => {
  try {
    const articleId = Number(req.params.id);

    if (isNaN(articleId)) {
      return res.status(400).json({
        error: "Invalid article id",
      });
    }

    const [rows] = await pool.execute(
      `
      SELECT 
        articles.id,
        articles.title,
        articles.body,
        articles.category,
        articles.createdAt,
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

export default router;
