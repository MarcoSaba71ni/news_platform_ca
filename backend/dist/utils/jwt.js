import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;
// generate token 
export function generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "24h" });
}
// validate token
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch (error) {
        return null;
    }
}
