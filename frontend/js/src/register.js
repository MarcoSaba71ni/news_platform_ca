import { registerUser } from "../api/auth.js";

const registerForm = document.getElementById("register-form");
const registerBtn = document.getElementById("register-btn");

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const userData = {
        name: registerForm.name.value.trim(),
        email: registerForm.email.value.trim(),
        password: registerForm.password.value.trim(),
    };

    // Frontend validation
    if (!userData.name || !userData.email || !userData.password) {
        alert("All fields are required!");
        return;
    }

    if (userData.password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
    }

    const originalBtnText = registerBtn.textContent;

    try {
        registerBtn.textContent = "Registering...";
        registerBtn.disabled = true;

        [...registerForm.querySelectorAll("input")].forEach(
            (input) => (input.disabled = true)
        );

        await registerUser(userData);

        alert("Registration successful. Redirecting to login.");
        window.location.href = "../pages/login.html";

    } catch (error) {
        console.error("Registration error:", error);
        alert(`Registration failed: ${error.message}`);
    } finally {
        [...registerForm.querySelectorAll("input")].forEach(
            (input) => (input.disabled = false)
        );
        registerBtn.disabled = false;
        registerBtn.textContent = originalBtnText;
    }
});
