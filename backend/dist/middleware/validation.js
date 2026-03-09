// Validate if userId is valid
export function validateUserId(req, res, next) {
    const userId = Number(req.params.id);
    if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid User Id" });
    }
    ;
    next();
}
;
// Validate if fully body data is valid
// for PUT/DELETE request
export function validateRequiredUserData(res, req, next) {
    const { id, email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }
    next();
}
