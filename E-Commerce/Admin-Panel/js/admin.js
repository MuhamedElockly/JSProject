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

      // Show logout message (styled, not alert)
      const msg = document.getElementById("successMessage");
      const overlay = document.getElementById("successOverlay");
      msg.textContent = "Logout successful! Redirecting to login...";
      msg.style.display = "block";
      overlay.style.display = "block";
      msg.style.animation = "fadeInOut 2.5s forwards";
      setTimeout(() => {
        msg.style.display = "none";
        overlay.style.display = "none";
        // Redirect to login page
        window.location.href = "../Login/login.html";
      }, 2000);
    });
  }

  // Profile form submission handler
  const profileForm = document.querySelector(".profile-form");
  if (profileForm) {
    profileForm.addEventListener("submit", function (e) {
      e.preventDefault();
      // Get values
      const nameInput = document.getElementById("name");
      const passwordInput = document.getElementById("password");
      const confirmPasswordInput = document.getElementById("confirm-password");
      const newName = nameInput.value.trim();
      const newPassword = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;
      // Simple validation
      if (newPassword && newPassword !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
      // Simulate successful update (replace with real API call if needed)
      nameInput.value = newName;
      passwordInput.value = "";
      confirmPasswordInput.value = "";
      // Show success message and overlay
      const successDiv = document.getElementById("successMessage");
      const successOverlay = document.getElementById("successOverlay");
      if (successDiv && successOverlay) {
        successDiv.textContent = "Profile updated successfully!";
        successDiv.style.display = "block";
        successOverlay.style.display = "block";
        setTimeout(() => {
          successDiv.style.display = "none";
          successOverlay.style.display = "none";
        }, 2500);
      }
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
  const allOrders = await res.json();
  // Only return orders with status 'Pending'
  return allOrders.filter(order => order.status === 'Pending');
}

// Add this function to update the Pending Approvals card with the count of pending orders
async function updatePendingApprovalsCard() {
  const res = await fetch(`${API_BASE_URL}/orders`);
  const allOrders = await res.json();
  const pendingOrders = allOrders.filter(order => order.status === 'Pending');
  document.getElementById('Pending-Approval').textContent = pendingOrders.length;
}

function displayAdminOrders(orders) {
  const tbody = document.querySelector("#Orders-Table tbody");
  tbody.innerHTML = "";
  orders.forEach((order) => {
    const total = order.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.userName}</td>
      <td>${order.cart
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
  const val = e.target.value.toLowerCase().trim();
  
  ordersSearchTimeout = setTimeout(() => {
    if (!val) {
      // If search is empty, show all orders
      filteredAdminOrders = adminOrders;
    } else {
      // Filter orders based on search criteria
      filteredAdminOrders = adminOrders.filter((order) => {
        // Search in userName
        const userNameMatch = order.userName?.toLowerCase().includes(val);
        
        // Search in status
        const statusMatch = order.status?.toLowerCase().includes(val);
        
        // Search in product names
        const productMatch = order.cart?.some(item => 
          item.name?.toLowerCase().includes(val)
        );
        
        // Search in order ID
        const orderIdMatch = order.id?.toString().includes(val);
        
        return userNameMatch || statusMatch || productMatch || orderIdMatch;
      });
    }
    
    // Reset to first page when searching
    currentOrdersPage = 1;
    
    // Update the table with filtered results
    updateAdminOrdersTable();
    
    // Update pagination
    const totalPages = Math.ceil(filteredAdminOrders.length / ordersPerPage);
    displayOrdersPagination(totalPages);
  }, 300); // Increased debounce time for better performance
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
    await updatePendingApprovalsCard();
  } catch (error) {
    alert("Failed to approve order. Please try again.");
  }
}

async function deleteAdminOrder(orderId) {
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
      <li><strong>Customer:</strong> ${order.userName}</li>
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
          ${order.cart
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
  
  // Add search input event listener
  const searchInput = document.querySelector(".orders-search");
  if (searchInput) {
    searchInput.addEventListener("input", handleAdminOrdersSearchInput);
  }
  
  document
    .getElementById("closeOrderDetailsModal")
    .addEventListener("click", closeOrderDetailsModal);
  await updatePendingApprovalsCard();
  document
    .getElementById("Orders-Table")
    .addEventListener("click", async (e) => {
      if (e.target.classList.contains("approve-btn")) {
        const orderId = e.target.dataset.id;
        // Show confirmation modal
        const modal = document.createElement("div");
        modal.className = "modal modern-popup";
        modal.style.display = "flex";
        modal.innerHTML = `
          <div class="modal-content">
            <h2>Approve Order</h2>
            <p>Are you sure you want to approve this order?</p>
            <div class="modal-actions">
              <button id="approve-order-confirm" class="modal-btn confirm-btn">Approve</button>
              <button id="approve-order-cancel" class="modal-btn cancel-btn">Cancel</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
        document.getElementById("overlay").style.display = "block";
        document
          .getElementById("approve-order-confirm")
          .addEventListener("click", async () => {
            await approveAdminOrder(orderId);
            await updatePendingApprovalsCard();
            document.body.removeChild(modal);
            document.getElementById("overlay").style.display = "none";
            // Show success message and overlay
            const successDiv = document.getElementById("successMessage");
            const successOverlay = document.getElementById("successOverlay");
            if (successDiv && successOverlay) {
              successDiv.textContent = "Order approved successfully!";
              successDiv.style.display = "block";
              successOverlay.style.display = "block";
              setTimeout(() => {
                successDiv.style.display = "none";
                successOverlay.style.display = "none";
              }, 2500);
            }
          });
        document
          .getElementById("approve-order-cancel")
          .addEventListener("click", () => {
            document.body.removeChild(modal);
            document.getElementById("overlay").style.display = "none";
          });
      } else if (e.target.classList.contains("delete-btn")) {
        const orderId = e.target.dataset.id;
        // Show confirmation modal for delete
        const modal = document.createElement("div");
        modal.className = "modal modern-popup";
        modal.style.display = "flex";
        modal.innerHTML = `
          <div class="modal-content">
            <h2>Delete Order</h2>
            <p>Are you sure you want to delete this order?</p>
            <div class="modal-actions">
              <button id="delete-order-confirm" class="modal-btn confirm-btn">Delete</button>
              <button id="delete-order-cancel" class="modal-btn cancel-btn">Cancel</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
        document.getElementById("overlay").style.display = "block";
        document
          .getElementById("delete-order-confirm")
          .addEventListener("click", async () => {
            await deleteAdminOrder(orderId);
            await updatePendingApprovalsCard();
            document.body.removeChild(modal);
            document.getElementById("overlay").style.display = "none";
            // Show success message and overlay
            const successDiv = document.getElementById("successMessage");
            const successOverlay = document.getElementById("successOverlay");
            if (successDiv && successOverlay) {
              successDiv.textContent = "Order deleted successfully!";
              successDiv.style.display = "block";
              successOverlay.style.display = "block";
              setTimeout(() => {
                successDiv.style.display = "none";
                successOverlay.style.display = "none";
              }, 2500);
            }
          });
        document
          .getElementById("delete-order-cancel")
          .addEventListener("click", () => {
            document.body.removeChild(modal);
            document.getElementById("overlay").style.display = "none";
          });
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
