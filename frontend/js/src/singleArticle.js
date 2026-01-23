import { renderSingleArticle } from "../render/renderArticles.js";
import { fetchArticleById } from "../api/articles.js";

// Get article ID from URL
const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get('id');
console.log('Fetched article ID from URL:', articleId);

// Fetch and render the article
async function loadSingleArticle() {
    try {
        const article = await fetchArticleById(articleId);
        console.log('Fetched article data:', article);
        renderSingleArticle(article);
    } catch (error) {
        console.error('Error loading article:', error);
        const articleContainer = document.getElementById('article-container');
        articleContainer.innerHTML = '<p>Error loading article. Please try again later.</p>';
    }   
}

// Load article on DOMContentLoaded
window.addEventListener('DOMContentLoaded', loadSingleArticle);     