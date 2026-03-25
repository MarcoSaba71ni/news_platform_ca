import { registerUser } from "../api/auth.js";

const registerForm = document.getElementById("register-form");
const registerBtn = document.getElementById("register-btn");

const nameSpan = document.getElementById("name-span");
const emailSpan = document.getElementById("email-span");
const passwordSpan = document.getElementById("password-span");
const generalSpan = document.getElementById("general-span");

const nameInput = registerForm.name;
const emailInput = registerForm.email;
const passwordInput = registerForm.password;


registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    function clearErrors() {
        document.querySelectorAll("span").forEach(span => {
        span.textContent = "";
        span.classList.add("hidden");
    });
    };

    clearErrors();



    const userData = {
        name: registerForm.name.value.trim(),
        email: registerForm.email.value.trim(),
        password: registerForm.password.value.trim(),
    };

    if (!userData.name || !userData.email || !userData.password) {
        if (!userData.name) {
            nameSpan.textContent = "Name is required.";
            nameSpan.classList.remove("hidden");
            nameInput.focus();
            return;
        }
        if (!userData.email) {
            emailSpan.textContent = "Email is required.";
            emailSpan.classList.remove("hidden");
            emailInput.focus();
            return;
        }
        if (!userData.password) {
            passwordSpan.textContent = "Password is required.";
            passwordSpan.classList.remove("hidden");
            passwordInput.focus();
            return;
        }
        return;
    }
    //first modification
    if (userData.password.length < 8) {
        passwordSpan.textContent = "Password must be at least 8 characters long.";
        passwordSpan.classList.remove("hidden");
        return;
    }

    const originalBtnText = registerBtn.textContent;

    try {
        registerBtn.textContent = "Registering...";
        registerBtn.disabled = true;

        [...registerForm.querySelectorAll("input")].forEach(
            (input) => (input.disabled = true)
        );

        await registerUser(userData);g

        alert("Registration successful. Redirecting to login.");
        window.location.href = "../pages/login.html";

    } catch (error) {
        console.error("Registration error:", error);
        generalSpan.textContent = (error || "An error occurred during registration. Please try again.");
        generalSpan.classList.remove("hidden");
    } finally {
        [...registerForm.querySelectorAll("input")].forEach(
            (input) => (input.disabled = false)
        );
        registerBtn.disabled = false;
        registerBtn.textContent = originalBtnText;
    }
});
