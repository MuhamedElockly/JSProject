const USER_API_BASE_URL = "http://localhost:3000";

let userCurrentPage = 1;
let usersPerPage = 5;
let totalUsers = 0;
let filteredUsers = [];

async function fetchUsers() {
  try {
    console.log("fetch");
    const response = await fetch(`${USER_API_BASE_URL}/users`);
    if (!response.ok) throw new Error();
    const users = await response.json();
    return users;
  } catch (error) {
    const tbody = document.querySelector("#Users-Table tbody");
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: red;">
            No users found.
          </td>
        </tr>
      `;
    }
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
        <select class="action-select role-select" data-id="${user.id}">
          <option value="" selected disabled>Change Role</option>
          ${user.role !== "admin" ? '<option value="admin">Admin</option>' : ""}
          ${
            user.role !== "seller"
              ? '<option value="seller">Seller</option>'
              : ""
          }
          ${user.role !== "user" ? '<option value="user">User</option>' : ""}
        </select>
      </td>
    `;
    tbody.appendChild(row);

    const roleSelects = row.querySelectorAll(".role-select");
    roleSelects.forEach((select) => {
      select.addEventListener("change", async (e) => {
        const userId = e.target.dataset.id;
        const newRole = e.target.value;
        if (newRole) {
          const modal = document.createElement("div");
          modal.className = "modal modern-popup";
          modal.innerHTML = `
          <div class="modal-content">
            <h2>Change Role</h2>
            <p>Are you sure you want to change this user role to ${newRole}?</p>
            <div class="modal-actions">
              <button id="approve-confirm" class="modal-btn confirm-btn">Approve</button>
              <button id="approve-cancel" class="modal-btn cancel-btn">Cancel</button>
            </div>
          </div>
        `;
          document.body.appendChild(modal);
          document.getElementById("overlay").style.display = "block";
          document
            .getElementById("approve-confirm")
            .addEventListener("click", async () => {
              await changeUserRole(userId, newRole);
              modal.remove();
              document.getElementById("overlay").style.display = "none";
            });
          document
            .getElementById("approve-cancel")
            .addEventListener("click", () => {
              modal.remove();
              document.getElementById("overlay").style.display = "none";
            });
        }
      });
    });
  });
}

async function changeUserRole(userId, newRole) {
  try {
    const response = await fetch(`${USER_API_BASE_URL}/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: newRole }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update user role: ${response.status} ${response.statusText}`
      );
    }
    const users = await fetchUsers();
    filteredUsers = users;
    totalUsers = users.length;
    updateTotalUsersCount(totalUsers);
    const totalPages = Math.ceil(totalUsers / usersPerPage);
    displayUsersPaginationButtons(totalPages);
    updateUsersPagination();
  } catch (error) {
    alert("Failed to change user role. Please try again.");
  }
}

function displayUsersPaginationButtons(totalPages) {
  const existingPagination = document.querySelector(
    "#Users-Table .pagination-container"
  );
  if (existingPagination) {
    existingPagination.remove();
  }
  console.log("paginationsssss");
  const paginationContainer = document.createElement("div");
  paginationContainer.className = "pagination-container";
  paginationContainer.innerHTML = `
        <button id="prev-page-users" class="pagination-btn" disabled>Previous</button>
        <div class="page-buttons"></div>
        <button id="next-page-users" class="pagination-btn">Next</button>
    `;
  const tableContainer = document.getElementById("Users-Table");

  tableContainer.appendChild(paginationContainer);
  const pageButtons = paginationContainer.querySelector(".page-buttons");
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.className = "page-btn";
    button.textContent = i;
    if (i === userCurrentPage) {
      button.disabled = true;
    }
    pageButtons.appendChild(button);
  }
  document.getElementById("prev-page-users").addEventListener("click", () => {
    if (userCurrentPage > 1) {
      userCurrentPage--;
      updateUsersPagination(users);
    }
  });

  document.getElementById("next-page-users").addEventListener("click", () => {
    if (userCurrentPage < totalPages) {
      userCurrentPage++;
      updateUsersPagination(users);
    }
  });

  const pageBtns = document.querySelectorAll("#Users-Table .page-btn");
  pageBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      userCurrentPage = parseInt(btn.textContent);
      updateUsersPagination(users);
    });
  });
}

function updateUsersPagination() {
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const prevBtn = document.getElementById("prev-page-users");
  const nextBtn = document.getElementById("next-page-users");
  const pageBtns = document.querySelectorAll("#Users-Table .page-btn");

  prevBtn.disabled = userCurrentPage === 1;
  nextBtn.disabled = userCurrentPage === totalPages;
  pageBtns.forEach((btn) => {
    const pageNum = parseInt(btn.textContent);
    btn.disabled = pageNum === userCurrentPage;
  });

  const startIndex = (userCurrentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentPageUsers = filteredUsers.slice(startIndex, endIndex);
  displayUsers(currentPageUsers);
}

function updateTotalUsersCount(total) {
  document.getElementById("Total-Users").textContent = total;
}

function setupUsersSearch() {
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
    userCurrentPage = 1;
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    displayUsersPaginationButtons(totalPages);
    updateUsersPagination();
  });
}

async function deleteUser(userId) {
  try {
    const response = await fetch(`${USER_API_BASE_URL}/users/${userId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(
        `Failed to delete user: ${response.status} ${response.statusText}`
      );
    }
    const users = await fetchUsers();
    //filteredUsers = users;
    totalUsers = users.length;
    updateTotalUsersCount(totalUsers);
    const totalPages = Math.ceil(totalUsers / usersPerPage);
    displayUsersPaginationButtons(totalPages);
    updateUsersPagination(users);
  } catch (error) {
    alert("Failed to delete user. Please try again.");
  }
}

async function makeUserAdmin(userId) {
  try {
    const response = await fetch(`${USER_API_BASE_URL}/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: "admin" }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update user role: ${response.status} ${response.statusText}`
      );
    }
    const users = await fetchUsers();
    // filteredUsers = users;
    totalUsers = users.length;
    updateTotalUsersCount(totalUsers);
    const totalPages = Math.ceil(totalUsers / usersPerPage);
    displayUsersPaginationButtons(totalPages);
    updateUsersPagination(users);
  } catch (error) {
    alert("Failed to make user admin. Please try again.");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  users = await fetchUsers();
  filteredUsers = users;
  totalUsers = filteredUsers.length;
  updateTotalUsersCount(totalUsers);
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  displayUsersPaginationButtons(Math.max(totalPages, 1));
  updateUsersPagination();
  setupUsersSearch();

  // document.addEventListener("click", async (e) => {
  //   if (e.target.classList.contains("delete-btn")) {
  //     const userId = e.target.dataset.id;
  //     if (confirm("Are you sure you want to delete this user?")) {
  //       await deleteUser(userId);
  //     }
  //   } else if (e.target.classList.contains("approve-btn")) {
  //     const userId = e.target.dataset.id;
  //     if (confirm("Are you sure you want to make this user an admin?")) {
  //       await makeUserAdmin(userId);
  //     }
  //   }
  // });
});
