import { loginUser } from "../api/auth.js";
import { saveToken } from "../storage/local.js";

const loginForm = document.getElementById('login-form');
const loginBtn = document.getElementById('login-btn');

const emailSpan = document.getElementById("email-span");
const passwordSpan = document.getElementById("password-span");
const generalSpan = document.getElementById("general-span");

function setSubmittingState(isSubmitting) {
    loginBtn.textContent = isSubmitting ? "Logging in..." : "Login";
    loginBtn.disabled = isSubmitting;
    [...loginForm.querySelectorAll("input")].forEach(
        (input) => (input.disabled = isSubmitting)
    );
}

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    function clearErrors() {
        document.querySelectorAll("span").forEach(span => {
        span.textContent = "";
        span.classList.add("hidden");
    });
    };
    clearErrors();
    const credentials = {
        email: loginForm.email.value,
        password: loginForm.password.value,
    };

    if (!credentials.email || !credentials.password) {
        if (!credentials.email) {
            emailSpan.textContent = "Email is required.";
            emailSpan.classList.remove("hidden");
            loginForm.email.focus();
            return;
        }
        if (!credentials.password) {
            passwordSpan.textContent = "Password is required.";
            passwordSpan.classList.remove("hidden");
            loginForm.password.focus();
            return;
        }
    }
    setSubmittingState(true);

    try {
        const result = await loginUser(credentials);
        if (result.data.token) {
            saveToken(result.data.token, result.data.user);
            window.location.href = "../index.html"; // ignore the page feed.html, doenst exist
            return;
        }
        throw new Error("Login failed. Please try again.");
    } catch (error) {
            console.error("Login failed:", error);
            generalSpan.textContent = error || "Login failed. Please try again.";
            generalSpan.classList.remove("hidden");
            setSubmittingState(false);
    }
    }
);
