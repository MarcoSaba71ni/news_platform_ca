import { Response, Request , NextFunction } from "express";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./database.js";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import userRouter from "./routes/users.js";
import articleRouter from "./routes/articles.js";




dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Dev platforms API",
      version: "1.0.0",
      description: "A simple API for managing users and posts",
    },
    servers: [{ url: `http://localhost:${PORT}` }],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// API documentation endpoint
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Middlewares Zones

app.use(express.json());
app.use(cors());

// API documentation endpoint



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

// Connect route modules

app.use("/users", userRouter);
app.use("/articles", articleRouter);



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
POST    /auth/register  
POST    /auth/login

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