import { apiGet, apiPost } from "./api.js";

// fetch all articles
export async function fetchArticles() {
    const result = await apiGet("/articles");
    return result.data;
};

// fetch a single article by ID
export async function fetchArticleById(articleId) {
    return await apiGet(`/articles/${articleId}`);
};

export async function postArticle(articleData) {
    return await apiPost("/articles", articleData);
}