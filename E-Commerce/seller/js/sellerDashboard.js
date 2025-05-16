const SELLER_ID = "5";
const API_BASE_URL = "http://localhost:3000";
let sellerProducts = [];
let filteredProducts = [];
let sellerOrders = [];
let filteredOrders = [];
let currentPage = 1;
let currentOrdersPage = 1;
let productsPerPage = 5;
let ordersPerPage = 5;
let searchTimeout;
let ordersSearchTimeout;

async function fetchSellerProducts() {
  const res = await fetch(`${API_BASE_URL}/products`);
  const allProducts = await res.json();

  return allProducts.filter(
    (product) => String(product.sellerId) === String(SELLER_ID)
  );
}

async function fetchSellerOrders() {
  const res = await fetch(`${API_BASE_URL}/orders`);
  const allOrders = await res.json();

  return allOrders.filter(
    (order) =>
      order.status === "Pending" &&
      order.cart.some((item) => String(item.sellerId) === String(SELLER_ID))
  );
}

function updateStats(products) {
  const approved = products.filter((p) => p.status === "Approved").length;
  const pendingProducts = products.filter((p) => p.status === "Pending").length;

  const pendingOrders = sellerOrders.length;
  document.getElementById("Approved-Products").textContent = approved;
  document.getElementById("Pending-Products").textContent = pendingProducts;
  const pendingOrdersCard = document.getElementById("Pending-Orders");
  if (pendingOrdersCard) {
    pendingOrdersCard.textContent = pendingOrders;
  }
}

function displayProducts(products) {
  const tbody = document.querySelector("#Products-Table tbody");
  tbody.innerHTML = "";
  products.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${product.status}</td>
      <td>${
        product.price !== undefined
          ? "$" + Number(product.price).toFixed(2)
          : ""
      }</td>
      <td>
        <button class="action-btn edit-btn" data-id="${
          product.id
        }">Edit</button>
        <button class="action-btn delete-btn" data-id="${
          product.id
        }">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function displayOrders(orders) {
  const tbody = document.querySelector("#Orders-Table tbody");
  tbody.innerHTML = "";

  if (orders.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" style="text-align: center;">No pending orders found</td></tr>';
    return;
  }

  orders.forEach((order) => {
    const sellerItems = order.cart.filter(
      (item) => String(item.sellerId) === String(SELLER_ID)
    );
    
    const total = sellerItems.reduce(
      (sum, item) => sum + (Number(item.price) * Number(item.quantity)),
      0
    );

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.userName}</td>
      <td>${sellerItems
        .map((item) => `${item.name} (${item.quantity})`)
        .join(", ")}</td>
      <td>$${total.toFixed(2)}</td>
      <td>${order.status}</td>
      <td>
        <button class="action-btn approve-btn" data-id="${order.id}">Approve</button>
        <button class="action-btn delete-btn" data-id="${order.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function displayPagination(totalPages) {
  const paginationDiv = document.getElementById("pagination");
  paginationDiv.innerHTML = "";
  if (totalPages <= 1) return;
  const container = document.createElement("div");
  container.className = "pagination-container";
  container.innerHTML = `
    <button class="pagination-btn" id="prev-page" ${
      currentPage === 1 ? "disabled" : ""
    }>Previous</button>
    <div class="page-buttons"></div>
    <button class="pagination-btn" id="next-page" ${
      currentPage === totalPages ? "disabled" : ""
    }>Next</button>
  `;
  paginationDiv.appendChild(container);
  const pageButtons = container.querySelector(".page-buttons");
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = "page-btn";
    btn.textContent = i;
    if (i === currentPage) btn.disabled = true;
    btn.addEventListener("click", () => {
      currentPage = i;
      updateTable();
    });
    pageButtons.appendChild(btn);
  }
  container.querySelector("#prev-page").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      updateTable();
    }
  });
  container.querySelector("#next-page").addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      updateTable();
    }
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
      updateOrdersTable();
    });
    pageButtons.appendChild(btn);
  }

  container.querySelector("#prev-orders-page").addEventListener("click", () => {
    if (currentOrdersPage > 1) {
      currentOrdersPage--;
      updateOrdersTable();
    }
  });

  container.querySelector("#next-orders-page").addEventListener("click", () => {
    if (currentOrdersPage < totalPages) {
      currentOrdersPage++;
      updateOrdersTable();
    }
  });
}

function updateTable() {
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  displayProducts(filteredProducts.slice(start, end));
  displayPagination(totalPages);
  updateStats(filteredProducts);
}

function handleSearchInput(e) {
  clearTimeout(searchTimeout);
  const val = e.target.value.toLowerCase();
  searchTimeout = setTimeout(() => {
    filteredProducts = sellerProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(val) ||
        p.category.toLowerCase().includes(val) ||
        p.status.toLowerCase().includes(val)
    );
    currentPage = 1;
    updateTable();
  }, 250);
}

function updateOrdersTable() {
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const start = (currentOrdersPage - 1) * ordersPerPage;
  const end = start + ordersPerPage;
  displayOrders(filteredOrders.slice(start, end));
  displayOrdersPagination(totalPages);
}

function handleOrdersSearchInput(e) {
  clearTimeout(ordersSearchTimeout);
  const val = e.target.value.toLowerCase().trim();
  
  ordersSearchTimeout = setTimeout(() => {
    if (!val) {
      filteredOrders = sellerOrders;
    } else {
      filteredOrders = sellerOrders.filter((order) => {
        const sellerItems = order.cart.filter(
          (item) => String(item.sellerId) === String(SELLER_ID)
        );
        
        const customerMatch = order.userName?.toLowerCase().includes(val);
        
        const productMatch = sellerItems.some(item => 
          item.name?.toLowerCase().includes(val)
        );
        
        const orderIdMatch = order.id?.toString().includes(val);
        
        return customerMatch || productMatch || orderIdMatch;
      });
    }
    
    currentOrdersPage = 1;
    
    updateOrdersTable();
  }, 300);
}

async function approveOrder(orderId) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "Approved" }),
    });

    if (!response.ok) {
      throw new Error("Failed to approve order");
    }

    sellerOrders = await fetchSellerOrders();
    filteredOrders = sellerOrders;
    updateOrdersTable();
    updateStats(sellerProducts);
  } catch (error) {
    alert("Failed to approve order. Please try again.");
  }
}

async function deleteOrder(orderId) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete order");
    }
    sellerOrders = sellerOrders.filter((order) => order.id !== orderId);
    filteredOrders = filteredOrders.filter((order) => order.id !== orderId);
    updateOrdersTable();
    updateStats(sellerProducts);
  } catch (error) {
    alert("Failed to delete order. Please try again.");
  }
}

function openOrderDetailsModal(order) {
  const modal = document.getElementById("orderDetailsModal");
  const content = document.getElementById("orderDetailsContent");
  
  const sellerItems = order.cart.filter(
    (item) => String(item.sellerId) === String(SELLER_ID)
  );
  
  const total = sellerItems.reduce(
    (sum, item) => sum + (Number(item.price) * Number(item.quantity)),
    0
  );
  
  content.innerHTML = `
    <ul class="order-details-list">
      <li><strong>Order ID:</strong> ${order.id}</li>
      <li><strong>Customer:</strong> ${order.userName}</li>
      <li><strong>Status:</strong> ${order.status}</li>
      <li><strong>Order Date:</strong> ${
        order.date ? new Date(order.date).toLocaleString() : ""
      }</li>
      <li><strong>Total:</strong> $${total.toFixed(2)}</li>
    </ul>
    <div class="order-details-products">
      <h3>Your Products in this Order</h3>
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
          ${sellerItems
            .map(
              (item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>$${Number(item.price).toFixed(2)}</td>
              <td>$${(Number(item.price) * Number(item.quantity)).toFixed(2)}</td>
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

document.addEventListener("DOMContentLoaded", async () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    document.getElementById("sellerName").textContent =
      currentUser.firstName + " " + currentUser.lastName;
    document.getElementById("sellerEmail").textContent = currentUser.email;
  }

  sellerProducts = await fetchSellerProducts();
  filteredProducts = sellerProducts;
  updateTable();

  try {
    sellerOrders = await fetchSellerOrders();
    filteredOrders = sellerOrders;
    console.log("Fetched orders:", sellerOrders);
    updateStats(sellerProducts);
  } catch (error) {
    console.error("Error fetching orders:", error);
    sellerOrders = [];
    filteredOrders = [];
    updateStats(sellerProducts);
  }

  document
    .querySelector(".search-input")
    .addEventListener("input", handleSearchInput);
  document
    .getElementById("addProductBtn")
    .addEventListener("click", () => openModal());
  document
    .getElementById("addProductBtnTop")
    .addEventListener("click", () => openModal());
  document.getElementById("closeModal").addEventListener("click", closeModal);

  document
    .querySelector(".orders-search")
    .addEventListener("input", handleOrdersSearchInput);

  document
    .querySelector('a[href="#products"]')
    .addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("Products-Table").style.display = "block";
      document.getElementById("Orders-Table").style.display = "none";
    });

  document.querySelector('a[href="#orders"]').addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("Products-Table").style.display = "none";
    document.getElementById("Orders-Table").style.display = "block";
    if (filteredOrders.length > 0) {
      updateOrdersTable();
    } else {
      const tbody = document.querySelector("#Orders-Table tbody");
      tbody.innerHTML =
        '<tr><td colspan="6" style="text-align: center;">No orders found</td></tr>';
    }
  });

  document
    .getElementById("Orders-Table")
    .addEventListener("click", async (e) => {
      if (e.target.classList.contains("approve-btn")) {
        const orderId = e.target.dataset.id;
        // Create confirm modal
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
        // Show overlay
        const overlay = document.getElementById("successOverlay");
        if (overlay) overlay.style.display = "block";
        // Confirm approve
        document
          .getElementById("approve-order-confirm")
          .addEventListener("click", async () => {
            await approveOrder(orderId);
            document.body.removeChild(modal);
            if (overlay) overlay.style.display = "none";
            // Show success message
            const msg = document.getElementById("successMessage");
            if (msg && overlay) {
              msg.textContent = "Order approved successfully!";
              msg.style.display = "block";
              overlay.style.display = "block";
              msg.style.animation = "fadeInOut 2.5s forwards";
              setTimeout(() => {
                msg.style.display = "none";
                overlay.style.display = "none";
              }, 2500);
            }
          });
        // Cancel approve
        document
          .getElementById("approve-order-cancel")
          .addEventListener("click", () => {
            document.body.removeChild(modal);
            if (overlay) overlay.style.display = "none";
          });
        return;
      } else if (e.target.classList.contains("delete-btn")) {
        const orderId = e.target.dataset.id;
        // Create confirm modal
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
        // Show overlay
        const overlay = document.getElementById("successOverlay");
        if (overlay) overlay.style.display = "block";
        // Confirm delete
        document
          .getElementById("delete-order-confirm")
          .addEventListener("click", async () => {
            await deleteOrder(orderId);
            document.body.removeChild(modal);
            if (overlay) overlay.style.display = "none";
            // Show success message
            const msg = document.getElementById("successMessage");
            if (msg && overlay) {
              msg.textContent = "Order deleted successfully!";
              msg.style.display = "block";
              overlay.style.display = "block";
              msg.style.animation = "fadeInOut 2.5s forwards";
              setTimeout(() => {
                msg.style.display = "none";
                overlay.style.display = "none";
              }, 2500);
            }
          });
        // Cancel delete
        document
          .getElementById("delete-order-cancel")
          .addEventListener("click", () => {
            document.body.removeChild(modal);
            if (overlay) overlay.style.display = "none";
          });
        return;
      }
    });

  document
    .getElementById("Products-Table")
    .addEventListener("click", async (e) => {
      if (e.target.classList.contains("delete-btn")) {
        const id = e.target.dataset.id;
        // Create confirm modal
        const modal = document.createElement("div");
        modal.className = "modal modern-popup";
        modal.style.display = "flex";
        modal.innerHTML = `
        <div class="modal-content">
          <h2>Delete Product</h2>
          <p>Are you sure you want to delete this product?</p>
          <div class="modal-actions">
            <button id="delete-confirm" class="modal-btn confirm-btn">Delete</button>
            <button id="delete-cancel" class="modal-btn cancel-btn">Cancel</button>
          </div>
        </div>
      `;
        document.body.appendChild(modal);
        // Show overlay
        const overlay = document.getElementById("successOverlay");
        if (overlay) overlay.style.display = "block";
        // Confirm delete
        document
          .getElementById("delete-confirm")
          .addEventListener("click", async () => {
            await deleteProduct(id);
            document.body.removeChild(modal);
            if (overlay) overlay.style.display = "none";
            // Show success message
            const msg = document.getElementById("successMessage");
            if (msg && overlay) {
              msg.textContent = "Product deleted successfully!";
              msg.style.display = "block";
              overlay.style.display = "block";
              msg.style.animation = "fadeInOut 2.5s forwards";
              setTimeout(() => {
                msg.style.display = "none";
                overlay.style.display = "none";
              }, 2500);
            }
          });
        // Cancel delete
        document
          .getElementById("delete-cancel")
          .addEventListener("click", () => {
            document.body.removeChild(modal);
            if (overlay) overlay.style.display = "none";
          });
        return;
      } else if (e.target.classList.contains("edit-btn")) {
        const id = e.target.dataset.id;
        openModal(id);
      }
    });

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      // Show styled success message and overlay
      const msg = document.getElementById("successMessage");
      const overlay = document.getElementById("successOverlay");
      if (msg && overlay) {
        msg.textContent = "Logged out successfully! Redirecting to login...";
        msg.style.display = "block";
        overlay.style.display = "block";
        msg.style.animation = "fadeInOut 2.5s forwards";
        setTimeout(() => {
          msg.style.display = "none";
          overlay.style.display = "none";
          window.location.href = "../Login/login.html";
        }, 2000);
      } else {
        // fallback
        window.location.href = "../Login/login.html";
      }
    });
  }

  document
    .getElementById("closeOrderDetailsModal")
    .addEventListener("click", closeOrderDetailsModal);

  document
    .getElementById("Orders-Table")
    .addEventListener("click", function (e) {
      if (
        e.target.classList.contains("approve-btn") ||
        e.target.classList.contains("delete-btn")
      )
        return;

      let row = e.target.closest("tr");
      if (!row) return;
      let orderId = row.firstElementChild.textContent;
      let order = sellerOrders.find((o) => o.id == orderId);
      if (order) openOrderDetailsModal(order);
    });
});

function openModal(editId) {
  const modal = document.getElementById("productModal");
  modal.style.display = "flex";
  const form = document.getElementById("productForm");

  form
    .querySelectorAll(".form-group")
    .forEach((group) => group.classList.remove("invalid"));
  if (editId) {
    document.getElementById("modalTitle").textContent = "Edit Product";

    const product = sellerProducts.find((p) => p.id == editId);
    if (!product) return;
    document.getElementById("productName").value = product.name;
    document.getElementById("productCategory").value = product.category;
    document.getElementById("productPrice").value =
      product.price !== undefined ? product.price : "";
    form.setAttribute("data-edit-id", editId);
    // Fill image URL if exists
    const photoInput = document.getElementById("productPhoto");
    const photoPreview = document.getElementById("photoPreview");
    if (product.imageUrl) {
      photoInput.value = product.imageUrl;
      photoPreview.src = product.imageUrl;
      photoPreview.style.display = "block";
    } else {
      photoInput.value = "";
      photoPreview.src = "";
      photoPreview.style.display = "none";
    }
  } else {
    document.getElementById("modalTitle").textContent = "Add Product";
    form.reset();
    form.removeAttribute("data-edit-id");
    // Reset image preview
    const photoPreview = document.getElementById("photoPreview");
    photoPreview.src = "";
    photoPreview.style.display = "none";
  }
}

function closeModal() {
  document.getElementById("productModal").style.display = "none";
}

async function deleteProduct(id) {
  await fetch(`${API_BASE_URL}/products/${id}`, { method: "DELETE" });
  sellerProducts = sellerProducts.filter((p) => p.id != id);
  filteredProducts = filteredProducts.filter((p) => p.id != id);
  updateTable();
}
