import { fetchArticles } from "./api/articles.js";
import { renderArticles } from "./render/renderArticles.js";    

const authStatusDiv = document.getElementById('auth-status');
const logoutBtn = document.getElementById('logout-btn');
const createArticleBtn = document.getElementById('create-article-btn');
const createArticleMsg = document.getElementById('create-article-msg');
let hideCreateArticleMessageTimeout;

// Function to check authentication status
function checkAuthStatus() {
    const token = localStorage.getItem('token');

    if(token) {
        authStatusDiv.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
    }

    return Boolean(token);
}

function showCreateArticleMessage() {
    clearTimeout(hideCreateArticleMessageTimeout);
    createArticleMsg.classList.remove('is-visible');
    void createArticleMsg.offsetWidth;
    createArticleMsg.classList.add('is-visible');

    hideCreateArticleMessageTimeout = setTimeout(() => {
        createArticleMsg.classList.remove('is-visible');
    }, 3000);
}

if (checkAuthStatus()) {
    createArticleBtn.addEventListener('click', () => {
        window.location.href = 'pages/create_article.html';
    });
} else {
    createArticleBtn.addEventListener('click', () => {
        showCreateArticleMessage();
    });
}

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


if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');   
        alert('You have been logged out');
        window.location.href = 'index.html';
    });
};