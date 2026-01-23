import { fetchArticles } from "./api/articles.js";
import { renderArticles } from "./render/renderArticles.js";    

const authStatusDiv = document.getElementById('auth-status');

// Function to check authentication status
function checkAuthStatus() {
    const token = localStorage.getItem('token');

    if(token) {
        authStatusDiv.classList.add('hidden');
    };
};

// Function to load and render articles
async function loadArticles() {
    const allArticles = await fetchArticles();
    console.log(allArticles);
    renderArticles(allArticles);
};

// Generating articles on page load
window.addEventListener('DOMContentLoaded', async () => {
    checkAuthStatus();
    loadArticles();
});

