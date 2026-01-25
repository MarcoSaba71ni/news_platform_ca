import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const createArticleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  body: z.string().min(10, "Body must be at least 10 characters"),
  category: z.string().optional(),
  media_url: z.string().url().optional(),
  media_alt: z.string().optional(),
  user_id: z.number().int().positive(),
});

export function validateCreateArticle(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const result = createArticleSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: result.error.issues.map(issue => issue.message),
    });
  }

  next();
}
