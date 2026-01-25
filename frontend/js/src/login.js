import { loginUser } from "../api/auth.js";
import { saveToken } from "../storage/local.js";

const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const credentials = {
        email: loginForm.email.value,
        password: loginForm.password.value,
    };

    try {
        const result = await loginUser(credentials);

        if (result.data.token) {
            saveToken(result.data.token, result.data.user);
            window.location.href = "./index.html"; // ignore the page feed.html, doenst exist
        } else if (result.errors?.[0]) {
            alert("Unexpected error: " + error.message);
        }
    } catch (error) {
            alert(error.message);
        }
});
