import { z } from "zod";
import { verifyToken } from "../utils/jwt.js";
// Register Schema
const registerSchema = z.object({
    email: z.email("Email must be a valid email"),
    password: z
        .string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, "Password must be at least 8 characters long and include uppercase, lowercase, number, and a special character"),
});
// Login Schema
const loginSchema = z.object({
    email: z.email("Email must be a valid email"),
    password: z.string()
});
//Validate register function
export function validateRegistration(req, res, next) {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: "Validation Failed",
            details: result.error.issues.map((issue) => issue.message)
        });
    }
    ;
    next();
}
// Validate login function
export function validateLogin(req, res, next) {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: "Validation Failed",
            details: result.error.issues.map((issue) => issue.message)
        });
    }
    ;
    next();
}
export function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            error: "Access token required"
        });
    }
    if (!authHeader.startsWith("Bearer")) {
        return res.status(401).json({
            error: "Token must be in format: Bearer <token>",
        });
    }
    const token = authHeader.substring(7);
    const payload = verifyToken(token);
    if (!payload) {
        return res.status(403).json({
            error: "Invalid or expired token",
        });
    }
    req.user = { id: payload.userId };
    next();
}
