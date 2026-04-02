const form = document.getElementById("loginForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const successMessage = document.getElementById("successMessage");

  let isValid = true;

  emailError.textContent = "";
  passwordError.textContent = "";
  successMessage.textContent = "";

  emailInput.classList.remove("error-input");
  passwordInput.classList.remove("error-input");

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    emailError.textContent = "Please enter your email ...";
    emailInput.classList.add("error-input");
    isValid = false;
  } else if (!emailRegex.test(email)) {
    emailError.textContent = "Email is not valid!";
    emailInput.classList.add("error-input");
    isValid = false;
  }

  if (!password) {
    passwordError.textContent = "Please enter your password ...";
    passwordInput.classList.add("error-input");
    isValid = false;
  }

  if (!isValid) return;

  const savedUser = JSON.parse(localStorage.getItem("user"));

  if (!savedUser) {
    emailError.textContent = "Account does not exist ...";
    emailInput.classList.add("error-input");
    return;
  }

  if (email !== savedUser.email) {
    emailError.textContent = "Email does not exist ...";
    emailInput.classList.add("error-input");
    return;
  }

  if (password !== savedUser.password) {
    passwordError.textContent = "Incorrect password ...";
    passwordInput.classList.add("error-input");
    return;
  }

  successMessage.textContent = "Sign In Successfully";

  setTimeout(() => {
    window.location.href = "../index.html";
  }, 1500);
});