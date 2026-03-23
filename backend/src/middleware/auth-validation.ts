import { z } from "zod";
import { Request , Response , NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";

// Register Schema
const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Email must be a valid email"),
    password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
});

// Login Schema
const loginSchema = z.object({
    email: z.string().email("Email must be a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters long")
});

//Validate register function

export function validateRegistration (req: Request, res: Response, next: NextFunction) {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            error: "Validation Failed",
            details: result.error.issues.map((issue) => issue.message)
        })
   };
   next()
}

// Validate login function

export function validateLogin (req: Request, res: Response , next: NextFunction) {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
    return res.status(400).json({
        error: "Validation Failed",
        details: result.error.issues.map((issue) => issue.message)
    })};

    next();
}

export function authenticateToken (req: Request, res: Response , next: NextFunction) {
    const authHeader = req.headers.authorization;


    if(!authHeader) {
        return res.status(401).json({
            error: "Access token required"
        });
    }

    if (!authHeader.startsWith("Bearer"))  {
        return res.status(401).json({
            error: "Token must be in format: Bearer <token>",
        })
    }

    const token = authHeader.substring(7);

    const payload = verifyToken(token);

    if(!payload) {
        return res.status(403).json({
        error: "Invalid or expired token",
        });
    }


    req.user = { id: payload.userId };
    next();
}