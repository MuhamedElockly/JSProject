const SELLER_ID = "5"; // Demo seller id
const API_BASE_URL = "http://localhost:3000";
let sellerProducts = [];
let filteredProducts = [];
let currentPage = 1;
let productsPerPage = 5;
let searchTimeout;

async function fetchSellerProducts() {
  const res = await fetch(`${API_BASE_URL}/products`);
  const allProducts = await res.json();
  return allProducts;
}

function updateStats(products) {
  const approved = products.filter(p => p.status === "Approved").length;
  const pending = products.filter(p => p.status === "Pending").length;
  document.getElementById("Approved-Products").textContent = approved;
  document.getElementById("Pending-Products").textContent = pending;
}

function displayProducts(products) {
  const tbody = document.querySelector("#Products-Table tbody");
  tbody.innerHTML = "";
  products.forEach(product => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${product.status}</td>
      <td>${product.price !== undefined ? '$' + Number(product.price).toFixed(2) : ''}</td>
      <td>
        <button class="action-btn edit-btn" data-id="${product.id}">Edit</button>
        <button class="action-btn delete-btn" data-id="${product.id}">Delete</button>
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
    <button class="pagination-btn" id="prev-page" ${currentPage === 1 ? "disabled" : ""}>Previous</button>
    <div class="page-buttons"></div>
    <button class="pagination-btn" id="next-page" ${currentPage === totalPages ? "disabled" : ""}>Next</button>
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
    filteredProducts = sellerProducts.filter(p =>
      p.name.toLowerCase().includes(val) ||
      p.category.toLowerCase().includes(val) ||
      p.status.toLowerCase().includes(val)
    );
    currentPage = 1;
    updateTable();
  }, 250);
}

document.addEventListener("DOMContentLoaded", async () => {
  sellerProducts = await fetchSellerProducts();
  filteredProducts = sellerProducts;
  updateTable();

  document.querySelector(".search-input").addEventListener("input", handleSearchInput);

  document.getElementById("addProductBtn").addEventListener("click", openModal);
  document.getElementById("addProductBtnTop").addEventListener("click", openModal);
  document.getElementById("closeModal").addEventListener("click", closeModal);

  document.getElementById("Products-Table").addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const id = e.target.dataset.id;
      await deleteProduct(id);
    } else if (e.target.classList.contains("edit-btn")) {
      const id = e.target.dataset.id;
      openModal(id);
    }
  });

  // Logout button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
  
      localStorage.removeItem("sellerToken");
    
      // window.location.href = "/login.html";
    });
  }
});

function openModal(editId) {
  const modal = document.getElementById("productModal");
  modal.style.display = "flex";
  const form = document.getElementById("productForm");

  form.querySelectorAll('.form-group').forEach(group => group.classList.remove('invalid'));
  if (editId) {
    document.getElementById("modalTitle").textContent = "Edit Product";
   
    const product = sellerProducts.find(p => p.id == editId);
    if (!product) return;
    document.getElementById("productName").value = product.name;
    document.getElementById("productCategory").value = product.category;
    document.getElementById("productPrice").value = product.price !== undefined ? product.price : '';
    form.setAttribute("data-edit-id", editId);
  } else {
    document.getElementById("modalTitle").textContent = "Add Product";
    form.reset();
    form.removeAttribute("data-edit-id");
  }
}

function closeModal() {
  document.getElementById("productModal").style.display = "none";
}

async function deleteProduct(id) {
  await fetch(`${API_BASE_URL}/products/${id}`, { method: "DELETE" });
  sellerProducts = sellerProducts.filter(p => p.id != id);
  filteredProducts = filteredProducts.filter(p => p.id != id);
  updateTable();
} 