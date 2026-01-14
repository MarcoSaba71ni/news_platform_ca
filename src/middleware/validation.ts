import { Response , Request , NextFunction } from "express";

// Validate if userId is valid
export function validateUserId(res: Response, req: Request, next: NextFunction) {
    
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
        return res.json(400).json({error:"Invalid User Id"});
    };

    next();
};

// Validate if fully body data is valid
// for PUT/DELETE request
export function validateRequiredUserId(res: Response , req: Request , next: NextFunction) {
    const { id , email } = req.body;

    if ( !email ) {
        return res.status(400).json({error: "Email is required"});
    }

    next();
}


// Validate partial data from the user
// For PATCH request
export function validatePartialUserId () {

}