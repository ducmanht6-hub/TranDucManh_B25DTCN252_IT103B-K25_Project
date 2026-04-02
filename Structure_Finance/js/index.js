function toggleMenu() {
    const menu = document.getElementById("dropdownMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

document.addEventListener("click", function (event) {
    const menu = document.getElementById("dropdownMenu");
    const btn = document.querySelector(".account-btn");

    if (!btn.contains(event.target) && !menu.contains(event.target)) {
        menu.style.display = "none";
    }
});

function openLogoutModal() {
  document.getElementById("dropdownMenu").style.display = "none";
  document.querySelector(".account-btn").classList.remove("active");

  const modal = document.getElementById("logoutModal");
  modal.classList.add("show");
}

function closeLogoutModal() {
  document.getElementById("logoutModal").classList.remove("show");
}

function handleLogout() {
    localStorage.getItem("user");
    window.location.href = "Pages/login.html";
}

window.onload = function () {
    const user = localStorage.getItem("user");
    if (!user) {
        window.location.href = "Pages/login.html";
    }
};