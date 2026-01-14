import { Router } from "express";
import { pool } from "../database.js";
import { ResultSetHeader } from "mysql2";

const router = Router();

// Authorization endpoints

router.post("/register", async (req, res) => {
    try {
    // Email and password validation
        const {email , password} = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and passwords are required"})
        }

        // Check if user exists
        const [userExist] = await pool.execute("SELECT * FROM users where email = ?", [email]);

        if((userExist as any []).length > 0) {
            return res.status(400).json({
                error: "User already exists"
            })
        }


        // Insert New Users
        const [newUser] = await pool.execute("INSERT INTO USERS (email, password_hash) values (?,?)", [email , password]);

        // define the type here I guess

        
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

router.post("/login", async (req, res) => {

    try {
        // 1. Validate email and password  
        const {email , password} = req.body;
        if (!email  || !password) {
            return res.status(400).json({error: "Email and password are required"})
        };
        // 2. Select User by email 
        // if not found error 401
        const [rows] = await pool.execute("SELECT id, email, password_hash FROM users where email = ?", 
            [email]
        );

        const users = rows as any [];

        // 3. User not found
        if(users.length === 0) {
            return res.status(401).json({error: "Invalid email or password"})
        }

        
        const user = users[0];
        // 4. Compare password 
        // To be replaced   

        if (user.password_hash !== password) {
            return res.status(401).json({error: "Incorrect Password"})
        }

        // Return response
        res.status(200).json({
            message: "Login successful",
            userId: user.id
        })

    } catch(error) {
        console.log(error);
        return res.status(500).json({
        error: "Failed to Login"
        })
    }
  
});

