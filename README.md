# Development Platforms – News Platform API

## Description
This project is a RESTful News Platform API developed as part of the Development Platforms Course Assignment.

The API allows users to register, log in, and see our list of articles. Articles can be viewed publicly without authentication providing the opportunity to the User to be logged in for further article creation, deleting and updating.

The project focuses on backend development using Express.js, TypeScript, MySQL, and JWT authentication, demonstrating secure data handling and API design. The Frontend is clear, organize and minimalistic.

## Features

User registration with hashed passwords
User login with JWT authentication
Public access to all articles
SQL injection prevention using parameterised queries

Further features implementation:
-- Authenticated article creation
-- Articles linked to the submitting user
-- Input validation and basic error handling

## Technology Stack

Node.js
Express.js
TypeScript
Tailwind CSS
MySQL (mysql2)
JWT for authentication
bcrypt for password hashing
Swagger for API documentation
Zod for validation schema

## API Endpoints

AUTHENTICATION:
- POST /auth/register
- POST /auth/login

ARTICLES:
- GET /articles
- GET /articles/id


-- Backend available (missing Frontend Implementation):
- USERS:
-- GET /users
-- GET /users/id

## Database Structure
The project uses a MySQL database with the following tables:

- USERS
id
email
password_hash
created_at

- ARTICLES
articles
id
title
body
category
created_at

An exported SQL schema is included in the repository.

## Installation & Configuration

1. Clone the repository
git clone https://github.com/MarcoSaba71ni/news_platform_ca.git
2. Install dependencies
npm install
3. Environment variables
Create a .env file based on .env.example and configure:
Database credentials
JWT secret
Server port
4. Import database
Import the provided .sql file into your MySQL database.
5. Run the project
npm run dev

## Authentication

JWT authentication is used to protect the article creation endpoint.
Authenticated users must include the token in the Authorization header when creating articles.

## Motivation

I chose Option 1 (Express API) because my long-term goal is to become a full-stack developer, not only a front-end developer. This project gave me the opportunity to work more deeply with backend concepts such as authentication, database integration, and API architecture.

I found this approach more exciting and meaningful, as it allowed me to understand how frontend and backend systems interact in a real-world application. Working on a custom API also helped me develop skills that are highly relevant in the job market and opened more opportunities from a career and employability perspective.

While building the backend required more setup and responsibility compared to using a backend-as-a-service solution, it provided greater insight into security, data handling, and application structure.

## Learning Outcomes

This project demonstrates:
Planning and building a backend API with authentication
Secure handling of user data and credentials
Integration of a relational database with an API
Use of modern backend development tools and workflows
Understanding of the trade-offs between custom APIs and backend-as-a-service solutions

## Notes

This project was developed for educational purposes as part of the Development Platforms course.
Other features related to updating, deleting, creation shall be implemented in the future for portfolio purposes.
