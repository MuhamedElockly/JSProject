async function fetchUsers() {
  try {
    const response = await fetch("http://localhost:3000/users");
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const users = await response.json();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

function displayUsers(users) {
  const tbody = document.querySelector("#Users-Table tbody");
  tbody.innerHTML = "";
  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button class="action-btn delete-btn" data-id="${
                  user.id
                }">Delete</button>
                ${
                  user.role !== "admin"
                    ? `<button class="action-btn approve-btn" data-id="${user.id}">Make Admin</button>`
                    : ""
                }
            </td>
        `;
    tbody.appendChild(row);
  });
}

let currentPage = 1;
let usersPerPage = 5;
let totalUsers = 0;
let filteredUsers = [];

function displayPaginationButtons(totalPages) {
  const paginationContainer = document.createElement("div");
  paginationContainer.className = "pagination-container";
  paginationContainer.innerHTML = `
        <button id="prev-page" class="pagination-btn" disabled>Previous</button>
        <div class="page-buttons"></div>
        <button id="next-page" class="pagination-btn">Next</button>
    `;
  const tableContainer = document.getElementById("Users-Table");
  tableContainer.appendChild(paginationContainer);
  const pageButtons = paginationContainer.querySelector(".page-buttons");
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.className = "page-btn";
    button.textContent = i;
    if (i === currentPage) {
      button.disabled = true;
    }
    pageButtons.appendChild(button);
  }
  document.getElementById("prev-page").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      updatePagination();
    }
  });

  document.getElementById("next-page").addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      updatePagination();
    }
  });

  const pageBtns = document.querySelectorAll(".page-btn");
  pageBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentPage = parseInt(btn.textContent);
      updatePagination();
    });
  });
}

function updatePagination() {
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const prevBtn = document.getElementById("prev-page");
  const nextBtn = document.getElementById("next-page");
  const pageBtns = document.querySelectorAll(".page-btn");

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
  pageBtns.forEach((btn) => {
    const pageNum = parseInt(btn.textContent);
    btn.disabled = pageNum === currentPage;
  });

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentPageUsers = filteredUsers.slice(startIndex, endIndex);
  displayUsers(currentPageUsers);
}

function updateTotalUsersCount(total) {
  document.getElementById("Total-Users").textContent = total;
}

function setupSearch() {
  const searchInput = document.querySelector("#Users-Table .search-input");
  searchInput.addEventListener("input", async (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const users = await fetchUsers();
    filteredUsers = users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm)
    );
    currentPage = 1;
    const existingPagination = document.querySelector(".pagination-container");
    if (existingPagination) {
      existingPagination.remove();
    }
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    displayPaginationButtons(totalPages);
    updatePagination();
  });
}
async function deleteUser(userId) {
  try {
    const response = await fetch(`http://localhost:3000/users/${userId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete user");
    }
    const users = await fetchUsers();
    displayUsers(users);
  } catch (error) {
    console.error("Error deleting user:", error);
    alert("Failed to delete user. Please try again.");
  }
}

async function makeUserAdmin(userId) {
  try {
    const response = await fetch(`http://localhost:3000/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: "admin" }),
    });

    if (!response.ok) {
      throw new Error("Failed to update user role");
    }
    const users = await fetchUsers();
    filteredUsers = users;
    updatePagination();
  } catch (error) {
    console.error("Error making user admin:", error);
    alert("Failed to make user admin. Please try again.");
  }
}

function setupActionButtons() {
  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const userId = e.target.dataset.id;
      if (confirm("Are you sure you want to delete this user?")) {
        await deleteUser(userId);
      }
    } else if (e.target.classList.contains("approve-btn")) {
      const userId = e.target.dataset.id;
      if (confirm("Are you sure you want to make this user an admin?")) {
        await makeUserAdmin(userId);
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const users = await fetchUsers();
  filteredUsers = users;
  totalUsers = users.length;
  updateTotalUsersCount(totalUsers);
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  displayPaginationButtons(totalPages);
  updatePagination();
  setupSearch();
  setupActionButtons();
});
