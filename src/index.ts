import { Response, Request , NextFunction } from "express";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares Zones

app.use(express.json());
app.use(cors());


// CheckAuth MIddleware function
function checkAuth(req:Request,res:Response,next:NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({error: "Missing authorization"});
    }
    if ( authHeader !== "Bearer secret123") {
        return res.status(403).json({error: "Access Denied"});
    }
    next();
}   


interface User {
    id: number;
    email: string;
    createdAt: string;
}

interface Article {
    id: number;
    title: string;
    body: string;
    category: string;
    submited_by: number;
    createdAt: string
}

const users: User[] = [];

// Authorization endpoints

app.post("/auth/register", async (req: Request, res: Response) => {
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

app.post("/auth/login", async (req: Request, res: Response) => {

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
  
})

// Users endpoints

app.get("/users", async (req , res) => {

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
        data: users
    })
    } catch(error) {
        console.log(error);
        return res.status(500).json({
            error: "Users could not be fetched"
        })
    }
})

app.get("/users/:id", async (req, res) => {
    try {
        const userId = Number(req.params.id);

        if (isNaN(userId)) {
            return res.json(400).json({error:"Invalid User Id"});
        };

        const [rows] = await pool.execute(`SELECT id, email, createdAt from users where id = ?`, [userId]);
        const users = rows as User[];

        if (users.length === 0) {
            return res.json(404).json({error: "User not found"})
        }

        const user = users[0];

        res.json(user);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({
      error: "Failed to fetch user"
    });
}});



// Articles endpoints

app.get("/articles", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [rows] = await pool.execute(
      `
      SELECT 
        articles.id,
        articles.title,
        articles.body,
        articles.category,
        articles.createdAt,
        users.id AS user_id,
        users.email
      FROM articles
      INNER JOIN users ON articles.user_id = users.id
      ORDER BY articles.createdAt DESC
      LIMIT ? OFFSET ?
      `,
    [limit.toString(), offset.toString()]
    );

    const articles = rows as Article[];

    res.json({
      page,
      limit,
      results: articles.length,
      data: articles,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch articles",
    });
  }
});


app.get('/articles/:id', async (req , res) => {
    try {
        const articleId = Number(req.params.id);

        if(isNaN(articleId)) {
            return res.status(400).json({
                 error: "Invalid article id" })
            };

        const [rows] = await pool.execute(`
            SELECT 
                    articles.id,
                    articles.title,
                    articles.body,
                    articles.category,
                    articles.createdAt,
                    users.id AS user_id,
                    users.email
                FROM articles
                INNER JOIN users on articles.user_id = users.id
                WHERE articles.id = ?`,
                [articleId]);
        const articles = rows as Article[];
        if (articles.length === 0 ) {
            return res.status(404).json({
                error: "Article not found"
            })
        }

        res.json(articles[0]);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Failed to fetch article"
        })
    }});





// Route example error
app.get("/test-error", (req, res) => {
  throw new Error("This is a test error!");
});

//Starts the server and listens for incoming requests
app.listen(PORT, () => {
    console.log(`Hello my newest server http://localhost:${PORT}`)
})

/*
access endpoints
POST /auth/register  
POST /auth/login

users endpoints
GET    /users           → list users (pagination)    DONE!
GET    /users/:id       → single user    DONE!

articles endpoints
GET    /articles            → list articles    DONE!
GET    /articles/:id        → single article    DONE!
POST   /articles            → create article (protected)
PATCH  /articles/:id        → update article (protected)
DELETE /articles/:id        → delete article (protected) 

*/