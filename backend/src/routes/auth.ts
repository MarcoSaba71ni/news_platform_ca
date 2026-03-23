import { Router } from "express";
import { pool } from "../database.js";
import { ResultSetHeader } from "mysql2";
import { validateRegistration , validateLogin  } from "../middleware/auth-validation.js";
import { RegisterRequest, User , UserResponse } from "../interface.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";

const router = Router();

// Authorization endpoints

router.post("/register", validateRegistration , async (req, res) => {
    try {
    // Email and password validation
        const {name , email , password} = req.body;
        console.log("REGISTER DATA:", name , email , password);

        // Check if user exists
        const [userExist] = await pool.execute("SELECT * FROM users where email = ?", [email]);

        const existingUser = userExist as User[];

        if(existingUser.length > 0) {
            return res.status(400).json({
                error: "User already exists"
            })
        }

        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(password, saltRounds)

        // Insert New Users
        const [newUser]: [ResultSetHeader, any] = await pool.execute("INSERT INTO users (name, email, password_hash) values (?,?,?)", [name, email , hashPassword]);

            const userResponse: RegisterRequest = {
            id: newUser.insertId,
            name,
            email,
        };
        // Success Response
        res.status(201). json({
            message: "User registered successfully!",
            userId: (newUser as any).insertId,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          error: "Failed to register user"  
        })
    }
})

router.post("/login", validateLogin , async (req, res) => {

    try {
        // 1. Validate email and password  
        const {email , password} = req.body;
        // 2. Select User by email 
        // if not found error 401
        const [rows] = await pool.execute("SELECT id, email, password_hash FROM users where email = ?", 
            [email]
        );

        const users = rows as User [];

        // 3. User not found
        if (users.length === 0) {
            return res.status(401).
            json({error: "Invalid email or password"})
        }

        
        const user = users[0];
        // 4. Compare password using bcrypt

        const validPassword = await bcrypt.compare(password , user.password_hash);

        if(!validPassword) {
            return res.status(401).json({
                error: "Invalid email or password"
            })
        }

        const token = generateToken(user.id);

        const userResponse: UserResponse = {
        id: user.id,
        email: user.email,
        };

        // Return response
        res.status(200).json({
            message: "Login successful",
            token,
            user: userResponse
        })

    } catch(error) {
        console.log(error);
        return res.status(500).json({
        error: "Failed to Login"
        })
    }
  
});

export default router;