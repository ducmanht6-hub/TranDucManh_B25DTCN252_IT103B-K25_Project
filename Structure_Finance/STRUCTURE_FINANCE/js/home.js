document.addEventListener("DOMContentLoaded", () => {
  // --- 1. KHAI BÁO PHẦN TỬ UI ---
  const monthPicker = document.getElementById("monthPicker");
  const moneyDisplay = document.getElementById("money");
  const budgetInput = document.getElementById("budgetInput");
  const saveBudgetBtn = document.getElementById("saveBudgetBtn");
  const logoutMenu = document.getElementById("logoutMenu");
  
  const infoModal = document.getElementById("infoModal");
  const passModal = document.getElementById("passModal");
  const logoutConfirmModal = document.getElementById("logoutConfirmModal");

  const editInfoForm = document.getElementById("editInfoForm");
  const editPassForm = document.getElementById("editPassForm");

  // --- 2. HÀM HỖ TRỢ (UTILITIES) ---
  const getStorageKey = (key) => {
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    return `user_${authUser ? authUser.id : "guest"}_${key}`;
  };

  const showToast = (msg, type = "success") => {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.className = `toast show ${type}`;
    setTimeout(() => { toast.className = "toast hidden"; }, 2000);
  };

  // Hiển thị thông tin lên các ô Input ở trang chủ
  const renderProfile = () => {
    const auth = JSON.parse(localStorage.getItem("authUser"));
    if (!auth) return;

    if (document.getElementById("mainName")) document.getElementById("mainName").value = auth.fullName || "";
    if (document.getElementById("mainEmail")) document.getElementById("mainEmail").value = auth.email || "";
    if (document.getElementById("mainPhone")) document.getElementById("mainPhone").value = auth.phone || "";
    if (document.getElementById("mainGender")) {
      document.getElementById("mainGender").value = (auth.gender === true || auth.gender === "Male") ? "Male" : "Female";
    }
  };

  // --- 3. LOGIC TÀI CHÍNH ---
  const updateFinancialStatus = () => {
    const month = monthPicker.value;
    if (!month) return;

    const monthKey = `${month}-30`;

    // Lấy Ngân Sách
    let allBudgets = [];
    try {
      allBudgets = JSON.parse(localStorage.getItem(getStorageKey("monthlyBudgets"))) || [];
    } catch (e) { allBudgets = []; }

    const currentBudgetObj = allBudgets.find(b => b.month === monthKey);
    const totalBudget = currentBudgetObj ? Number(currentBudgetObj.budget) : 0;
    
    if (document.activeElement !== budgetInput) {
      budgetInput.value = totalBudget > 0 ? totalBudget : "";
    }

    // Lấy Chi Tiêu
    let monthlyCategories = [];
    try {
      monthlyCategories = JSON.parse(localStorage.getItem(getStorageKey("monthlyCategories"))) || [];
    } catch (e) { monthlyCategories = []; }

    const monthEntry = monthlyCategories.find(m => m.month === monthKey);
    let totalSpent = 0;
    if (monthEntry && monthEntry.categories) {
      totalSpent = monthEntry.categories.reduce((sum, cat) => sum + Number(cat.budget || 0), 0);
    }

    const remaining = totalBudget - totalSpent;
    
    if (moneyDisplay) {
      moneyDisplay.textContent = `${remaining.toLocaleString("vi-VN")} VND`;
      moneyDisplay.style.color = remaining < 0 ? "#EF4444" : "#22C55E";
    }
  };

  // --- 4. XỬ LÝ SỰ KIỆN FORM & MODAL ---

  // LƯU THÔNG TIN CÁ NHÂN
  if (editInfoForm) {
    editInfoForm.onsubmit = (e) => {
      e.preventDefault();
      const auth = JSON.parse(localStorage.getItem("authUser"));
      
      const updatedUser = {
        ...auth,
        fullName: document.getElementById("editName").value,
        email: document.getElementById("editEmail").value,
        phone: document.getElementById("editPhone").value,
        gender: document.getElementById("editGender").value
      };

      localStorage.setItem("authUser", JSON.stringify(updatedUser));

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const idx = users.findIndex(u => u.id === updatedUser.id);
      if (idx !== -1) {
        users[idx] = updatedUser;
        localStorage.setItem("users", JSON.stringify(users));
      }

      showToast("✓ Cập nhật thông tin thành công!");
      infoModal.style.display = "none";
      renderProfile();
    };
  }

  // ĐỔI MẬT KHẨU
  if (editPassForm) {
    editPassForm.onsubmit = (e) => {
      e.preventDefault();
      const auth = JSON.parse(localStorage.getItem("authUser"));
      const currentPass = document.getElementById("currentPass").value;
      const newPass = document.getElementById("newPass").value;
      const confirmPass = document.getElementById("confirmPass").value;

      if (currentPass !== auth.password) {
        showToast("Mật khẩu hiện tại không đúng!", "error");
        return;
      }
      if (newPass !== confirmPass) {
        showToast("Mật khẩu xác nhận không khớp!", "error");
        return;
      }

      auth.password = newPass;
      localStorage.setItem("authUser", JSON.stringify(auth));

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const idx = users.findIndex(u => u.id === auth.id);
      if (idx !== -1) {
        users[idx].password = newPass;
        localStorage.setItem("users", JSON.stringify(users));
      }

      showToast("✓ Đổi mật khẩu thành công!");
      passModal.style.display = "none";
      editPassForm.reset();
    };
  }

  // Mở Modals (Dùng flex để căn giữa theo CSS mới)
  document.getElementById("openInfoModal")?.addEventListener("click", () => {
    const auth = JSON.parse(localStorage.getItem("authUser"));
    document.getElementById("editName").value = auth.fullName || "";
    document.getElementById("editEmail").value = auth.email || "";
    document.getElementById("editPhone").value = auth.phone || "";
    document.getElementById("editGender").value = (auth.gender === true || auth.gender === "Male") ? "Male" : "Female";
    infoModal.style.display = "flex";
  });

  document.getElementById("openPassModal")?.addEventListener("click", () => {
    editPassForm.reset();
    passModal.style.display = "flex";
  });

  // Đóng Modal khi bấm nút Cancel/X hoặc bên ngoài
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-cancel") || e.target.classList.contains("close-btn")) {
      const modal = e.target.closest(".modal");
      if (modal) modal.style.display = "none";
    }
    if (!e.target.closest("#accountDropdown")) {
      logoutMenu?.classList.add("hidden");
    }
  });

  // --- 5. CÁC SỰ KIỆN KHÁC ---

  saveBudgetBtn?.addEventListener("click", () => {
    const amount = Number(budgetInput.value);
    if (isNaN(amount) || amount < 0) {
      showToast("Vui lòng nhập số tiền hợp lệ!", "error");
      return;
    }
    const monthKey = `${monthPicker.value}-30`;
    let allBudgets = JSON.parse(localStorage.getItem(getStorageKey("monthlyBudgets"))) || [];
    const idx = allBudgets.findIndex(b => b.month === monthKey);
    
    if (idx > -1) allBudgets[idx].budget = amount;
    else allBudgets.push({ month: monthKey, budget: amount, id: Date.now() });

    localStorage.setItem(getStorageKey("monthlyBudgets"), JSON.stringify(allBudgets));
    showToast("✓ Đã lưu ngân sách!");
    updateFinancialStatus();
  });

  document.querySelector(".account-btn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    logoutMenu.classList.toggle("hidden");
  });

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    logoutConfirmModal.style.display = "flex";
  });

  document.getElementById("confirmLogoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("authUser");
    window.location.href = "./login.html";
  });

  if (monthPicker) {
    if (!monthPicker.value) monthPicker.value = new Date().toISOString().slice(0, 7);
    monthPicker.onchange = updateFinancialStatus;
  }

  // Khởi tạo ban đầu
  renderProfile(); 
  updateFinancialStatus(); 
});