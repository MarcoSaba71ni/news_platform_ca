import { fetchArticles } from "./api/articles.js";
import { renderArticles } from "./render/renderArticles.js";    

const authStatusDiv = document.getElementById('auth-status');
const logoutBtn = document.getElementById('logout-btn');

// Function to check authentication status
function checkAuthStatus() {
    const token = localStorage.getItem('token');

    if(token) {
        authStatusDiv.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
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


if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');   
        alert('You have been logged out');
        window.location.href = '../pages/index.html';
    });
};