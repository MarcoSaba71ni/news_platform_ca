import { Response , Request , NextFunction } from "express";
import  { z } from "zod";

// SCHEMAS
// Checking if request has both username and email
const requiredUserDataSchema = z.object({
    username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(50, "Username must not exceed 50 characters"),
    email: z.email("Email must be a valid email"),
});

// Define ID as a number and requirements
const userIdSchema = z.object({
    id: z.string()
    .regex(/^\d+$/, "ID must be a positive number")
});


// VALIDATION FUNCTION
// Validate userId function
export function validateUserId(req: Request, res: Response,  next: NextFunction) {
    
    const result = userIdSchema.safeParse(req.params);
    
    if (!result.success) {
        return res.status(400).json({
            error: "Validation Failed",
            details: result.error.issues.map((issue) => issue.message)
        })
    }

    next();
};

// Validate User Data
// for PUT/DELETE request
export function validateRequiredUserData(req: Request , res: Response ,  next: NextFunction) {

    const result = requiredUserDataSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: "Validation Failed",
            details: result.error.issues.map((issue) => issue.message)
        })
    }

    next();
}


