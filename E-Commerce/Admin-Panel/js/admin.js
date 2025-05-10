document.addEventListener("DOMContentLoaded", function () {
  const usersBtn = document.getElementById("Users-Btn");
  const productsBtn = document.getElementById("Products-Btn");
  const ordersBtn = document.getElementById("Orders-Btn");
  const profileBtn = document.getElementById("ProfileEdit-Btn");
  const usersTable = document.getElementById("Users-Table");
  const productsTable = document.getElementById("Products-Table");
  const ordersTable = document.getElementById("Orders-Table");
  const profileTable = document.getElementById("ProfileEdit-Table");
  const statsContainer = document.querySelector(".stats-container");
  usersTable.style.display = "none";
  productsTable.style.display = "none";
  ordersTable.style.display = "none";
  profileTable.style.display = "none";
  statsContainer.style.display = "none";

  function hideAllSections() {
    usersTable.style.display = "none";
    productsTable.style.display = "none";
    ordersTable.style.display = "none";
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

  ordersBtn.addEventListener("click", function (e) {
    e.preventDefault();
    showSection(ordersTable);
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

const API_BASE_URL = "http://localhost:3000";
let adminOrders = [];
let filteredAdminOrders = [];
let currentOrdersPage = 1;
let ordersPerPage = 5;
let ordersSearchTimeout;

async function fetchAllOrders() {
  const res = await fetch(`${API_BASE_URL}/orders`);
  return await res.json();
}

function displayAdminOrders(orders) {
  const tbody = document.querySelector("#Orders-Table tbody");
  tbody.innerHTML = "";
  orders.forEach((order) => {
    const total = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.customerName}</td>
      <td>${order.items
        .map((item) => `${item.name} (${item.quantity})`)
        .join(", ")}</td>
      <td>$${total.toFixed(2)}</td>
      <td>${order.status}</td>
      <td>
        ${
          order.status === "Pending"
            ? `
          <button class="action-btn approve-btn" data-id="${order.id}">Approve</button>
          <button class="action-btn delete-btn" data-id="${order.id}">Delete</button>
        `
            : ""
        }
      </td>
    `;
    tbody.appendChild(row);
  });
}

function displayOrdersPagination(totalPages) {
  const paginationDiv = document.getElementById("orders-pagination");
  paginationDiv.innerHTML = "";
  if (totalPages <= 1) return;
  const container = document.createElement("div");
  container.className = "pagination-container";
  container.innerHTML = `
    <button class="pagination-btn" id="prev-orders-page" ${
      currentOrdersPage === 1 ? "disabled" : ""
    }>Previous</button>
    <div class="page-buttons"></div>
    <button class="pagination-btn" id="next-orders-page" ${
      currentOrdersPage === totalPages ? "disabled" : ""
    }>Next</button>
  `;
  paginationDiv.appendChild(container);
  const pageButtons = container.querySelector(".page-buttons");
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = "page-btn";
    btn.textContent = i;
    if (i === currentOrdersPage) btn.disabled = true;
    btn.addEventListener("click", () => {
      currentOrdersPage = i;
      updateAdminOrdersTable();
    });
    pageButtons.appendChild(btn);
  }
  container.querySelector("#prev-orders-page").addEventListener("click", () => {
    if (currentOrdersPage > 1) {
      currentOrdersPage--;
      updateAdminOrdersTable();
    }
  });
  container.querySelector("#next-orders-page").addEventListener("click", () => {
    if (currentOrdersPage < totalPages) {
      currentOrdersPage++;
      updateAdminOrdersTable();
    }
  });
}

function updateAdminOrdersTable() {
  const totalPages = Math.ceil(filteredAdminOrders.length / ordersPerPage);
  const start = (currentOrdersPage - 1) * ordersPerPage;
  const end = start + ordersPerPage;
  displayAdminOrders(filteredAdminOrders.slice(start, end));
  displayOrdersPagination(totalPages);
}

function handleAdminOrdersSearchInput(e) {
  clearTimeout(ordersSearchTimeout);
  const val = e.target.value.toLowerCase();
  ordersSearchTimeout = setTimeout(() => {
    filteredAdminOrders = adminOrders.filter(
      (order) =>
        order.customerName.toLowerCase().includes(val) ||
        order.status.toLowerCase().includes(val)
    );
    currentOrdersPage = 1;
    updateAdminOrdersTable();
  }, 250);
}

async function approveAdminOrder(orderId) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "Approved" }),
    });
    if (!response.ok) throw new Error("Failed to approve order");
    adminOrders = await fetchAllOrders();
    filteredAdminOrders = adminOrders;
    updateAdminOrdersTable();
  } catch (error) {
    alert("Failed to approve order. Please try again.");
  }
}

async function deleteAdminOrder(orderId) {
  if (!confirm("Are you sure you want to delete this order?")) return;
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete order");
    adminOrders = adminOrders.filter((order) => order.id !== orderId);
    filteredAdminOrders = filteredAdminOrders.filter(
      (order) => order.id !== orderId
    );
    updateAdminOrdersTable();
  } catch (error) {
    alert("Failed to delete order. Please try again.");
  }
}

function openOrderDetailsModal(order) {
  const modal = document.getElementById("orderDetailsModal");
  const content = document.getElementById("orderDetailsContent");
  content.innerHTML = `
    <ul class="order-details-list">
      <li><strong>Order ID:</strong> ${order.id}</li>
      <li><strong>Customer:</strong> ${order.customerName}</li>
      <li><strong>Status:</strong> ${order.status}</li>
      <li><strong>Order Date:</strong> ${
        order.orderDate ? new Date(order.orderDate).toLocaleString() : ""
      }</li>
      <li><strong>Total:</strong> $${
        order.totalAmount ? order.totalAmount.toFixed(2) : ""
      }</li>
    </ul>
    <div class="order-details-products">
      <h3>Products</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${order.items
            .map(
              (item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>$${item.price.toFixed(2)}</td>
              <td>$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
  modal.style.display = "flex";
}

function closeOrderDetailsModal() {
  document.getElementById("orderDetailsModal").style.display = "none";
}


window.addEventListener("DOMContentLoaded", async () => {
  // Navigation: Add a way to show Orders-Table (for demo, show on load)
  // document.getElementById("Orders-Table").style.display = "block";
  adminOrders = await fetchAllOrders();
  filteredAdminOrders = adminOrders;
  updateAdminOrdersTable();
  document
    .querySelector(".orders-search")
    .addEventListener("input", handleAdminOrdersSearchInput);
  document
    .getElementById("closeOrderDetailsModal")
    .addEventListener("click", closeOrderDetailsModal);
  document
    .getElementById("Orders-Table")
    .addEventListener("click", async (e) => {
      if (e.target.classList.contains("approve-btn")) {
        const orderId = e.target.dataset.id;
        await approveAdminOrder(orderId);
      } else if (e.target.classList.contains("delete-btn")) {
        const orderId = e.target.dataset.id;
        await deleteAdminOrder(orderId);
      } else {
        // Open modal on row click (not on buttons)
        let row = e.target.closest("tr");
        if (!row) return;
        let orderId = row.firstElementChild.textContent;
        let order = adminOrders.find((o) => o.id == orderId);
        if (order) openOrderDetailsModal(order);
      }
    });
});
