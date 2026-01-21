export interface User {
    id: number;
    email: string;
    password_hash: string,
    createdAt: string;
}

export interface UserResponse {
    id: number;
    email: string;
}

export interface Article {
    id: number;
    title: string;
    body: string;
    category: string;
    submited_by: number;
    createdAt: string
}

export interface ArticleWithUser extends Article {
    id: number,
    email:string
}