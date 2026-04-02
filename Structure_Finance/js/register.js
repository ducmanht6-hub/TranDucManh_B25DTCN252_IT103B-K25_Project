document.getElementById("registerForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelectorAll('input[type="password"]')[0];
    const confirmInput = document.querySelectorAll('input[type="password"]')[1];

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmInput.value.trim();

    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmError = document.getElementById("confirmError");
    const successMessage = document.getElementById("successMessage");

    emailError.textContent = "";
    passwordError.textContent = "";
    confirmError.textContent = "";
    successMessage.textContent = "";

    emailInput.classList.remove("input-error");
    passwordInput.classList.remove("input-error");
    confirmInput.classList.remove("input-error");

    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        emailError.textContent = "Please enter your email ...";
        emailInput.classList.add("input-error");
        isValid = false;
    } else if (!emailRegex.test(email)) {
        emailError.textContent = "Email is not valid!";
        emailInput.classList.add("input-error");
        isValid = false;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!password) {
        passwordError.textContent = "Please enter your password ...";
        passwordInput.classList.add("input-error");
        isValid = false;
    } else if (password.length < 6) {
        passwordError.textContent = "Passwords must at least 6 characters!";
        passwordInput.classList.add("input-error");
        isValid = false;
    } else if (!hasUpperCase) {
        passwordError.textContent = "Passwords must contain uppercase letter!";
        passwordInput.classList.add("input-error");
        isValid = false;
    } else if (!hasNumber) {
        passwordError.textContent = "Passwords must contain a number!";
        passwordInput.classList.add("input-error");
        isValid = false;
    }

    if (!confirmPassword) {
        confirmError.textContent = "Please enter your confirm password ...";
        confirmInput.classList.add("input-error");
        isValid = false;
    } else if (confirmPassword !== password) {
        confirmError.textContent = "Your passwords are not match!";
        confirmInput.classList.add("input-error");
        isValid = false;
    }

    if (isValid) {
        successMessage.textContent = "Sign Up Successfully!";

        const user = {
            email: email,
            password: password
        };

        localStorage.setItem("user", JSON.stringify(user));
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
    }
});