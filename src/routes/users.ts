import { Router } from "express";
import { pool } from "../database.js";
import { User } from "../interface.js";

const router = Router();

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
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [rows] = await pool.execute(
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
router.get("/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);

    const [rows] = await pool.execute(
      `SELECT id, email, createdAt FROM users WHERE id = ?`,
      [userId]
    );

    const users = rows as User[];

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

export default router;
