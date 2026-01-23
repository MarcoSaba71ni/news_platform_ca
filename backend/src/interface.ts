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
    createdAt: string;
    media_url: string | null;
    media_alt: string | null;
}

export interface ArticleWithUser extends Article {
    id: number,
    email:string
}