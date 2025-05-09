document.addEventListener("DOMContentLoaded", function () {
  const usersBtn = document.getElementById("Users-Btn");
  const productsBtn = document.getElementById("Products-Btn");
  const profileBtn = document.getElementById("ProfileEdit-Btn");
  const usersTable = document.getElementById("Users-Table");
  const productsTable = document.getElementById("Products-Table");
  const profileTable = document.getElementById("ProfileEdit-Table");
  const statsContainer = document.querySelector(".stats-container");
  usersTable.style.display = "none";
  productsTable.style.display = "none";
  profileTable.style.display = "none";
  statsContainer.style.display = "none";

  function hideAllSections() {
    usersTable.style.display = "none";
    productsTable.style.display = "none";
    profileTable.style.display = "none";
    statsContainer.style.display = "none";
  }

  function showSection(section) {
    hideAllSections();
    if (section !== profileTable) {
      statsContainer.style.display = "grid";
    }
    section.style.display = "block";
  }

  usersBtn.addEventListener("click", function (e) {
    e.preventDefault();
    showSection(usersTable);
  });

  productsBtn.addEventListener("click", function (e) {
    e.preventDefault();
    showSection(productsTable);
  });

  profileBtn.addEventListener("click", function (e) {
    e.preventDefault();
    showSection(profileTable);
  });

  const logoutBtn = document.getElementById("Logout-Btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      // Clear user data from localStorage
      localStorage.removeItem("currentUser");
      
      // Show logout message
      alert("Logged out successfully");
      
      // Redirect to login page
      window.location.href = "../Login/login.html";
    });
  }

  showSection(usersTable);
});
