const authStatusDiv = document.getElementById('auth-status');

// Function to check authentication status
function checkAuthStatus() {
    const token = localStorage.getItem('token');

    if(token) {
        authStatusDiv.classList.add('hidden');
    };
};