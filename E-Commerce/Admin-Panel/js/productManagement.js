const PRODUCT_API_BASE_URL = "http://localhost:3000"; // Change this to match your backend URL

let productCurrentPage = 1;
let productsPerPage = 5;
let totalProducts = 0;
let filteredProducts = [];
let products = [];

async function fetchProducts() {
  console.log("products");
  try {
    const response = await fetch(`${PRODUCT_API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch products: ${response.status} ${response.statusText}`
      );
    }
    const products = await response.json();

    return products;
  } catch (error) {
    const tbody = document.querySelector("#Products-Table tbody");
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: red;">
            Failed to load products. Please make sure the backend server is running.
          </td>
        </tr>
      `;
    }
    return [];
  }
}
function setupProductsSearch() {
  const searchInput = document.querySelector("#Products-Table .search-input");
  searchInput.addEventListener("input", async (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const products = await fetchProducts();
    filteredProducts = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.status.toLowerCase().includes(searchTerm)
    );
    productCurrentPage = 1;
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    displayPaginationButtons(totalPages);
    updatePagination();
  });
}
function displayPaginationButtons(totalPages) {
  const existingPagination = document.querySelector(
    "#Products-Table .pagination-container"
  );
  if (existingPagination) {
    existingPagination.remove();
  }

  const paginationContainer = document.createElement("div");
  paginationContainer.className = "pagination-container";
  paginationContainer.innerHTML = `
        <button id="prev-page-products" class="pagination-btn" disabled>Previous</button>
        <div class="page-buttons"></div>
        <button id="next-page-products" class="pagination-btn">Next</button>
    `;
  const tableContainer = document.getElementById("Products-Table");
  tableContainer.appendChild(paginationContainer);
  const pageButtons = paginationContainer.querySelector(".page-buttons");
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.className = "page-btn";
    button.textContent = i;
    if (i === productCurrentPage) {
      button.disabled = true;
    }
    pageButtons.appendChild(button);
  }
  document
    .getElementById("prev-page-products")
    .addEventListener("click", () => {
      if (productCurrentPage > 1) {
        productCurrentPage--;
        updatePagination();
      }
    });

  document
    .getElementById("next-page-products")
    .addEventListener("click", () => {
      if (productCurrentPage < totalPages) {
        productCurrentPage++;
        updatePagination();
      }
    });

  const pageBtns = document.querySelectorAll("#Products-Table .page-btn");
  pageBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      productCurrentPage = parseInt(btn.textContent);
      updatePagination();
    });
  });
  updatePagination();
}

function updatePagination() {
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const prevBtn = document.getElementById("prev-page-products");
  const nextBtn = document.getElementById("next-page-products");
  const pageBtns = document.querySelectorAll("#Products-Table .page-btn");

  prevBtn.disabled = productCurrentPage === 1;
  nextBtn.disabled = productCurrentPage === totalPages;
  pageBtns.forEach((btn) => {
    const pageNum = parseInt(btn.textContent);
    btn.disabled = pageNum === productCurrentPage;
  });

  const startIndex = (productCurrentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentPageProducts = filteredProducts.slice(startIndex, endIndex);
  displayProducts(currentPageProducts);
}
function updateTotalProductsCount(total) {
  document.getElementById("Total-Products").textContent = total;
}
function displayProducts(products) {
  const tbody = document.querySelector("#Products-Table tbody");
  if (!tbody) {
    return;
  }
  tbody.innerHTML = "";
  products.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${product.status}</td>
      <td class="action-cell">
        <button class="action-btn approve-btn" data-id="${product.id}" style="${
      product.status === "Pending" ? "" : "visibility: hidden;"
    }">Approve</button>
        <button class="action-btn delete-btn" data-id="${
          product.id
        }">Delete</button>
      </td>
    `;
    tbody.appendChild(row);

    const approveBtns = row.querySelectorAll(".approve-btn");
    approveBtns.forEach((approveBtn) => {
      approveBtn.addEventListener("click", async (e) => {
        const productId = e.target.dataset.id;
        const modal = document.createElement("div");
        modal.className = "modal modern-popup";
        modal.innerHTML = `
          <div class="modal-content">
            <h2>Approve Product</h2>
            <p>Are you sure you want to approve this product?</p>
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
            await approveProduct(productId);
            document.body.removeChild(modal);
            document.getElementById("overlay").style.display = "none";
          });

        document
          .getElementById("approve-cancel")
          .addEventListener("click", () => {
            document.body.removeChild(modal);
            document.getElementById("overlay").style.display = "none";
          });
      });
    });
    const deleteBtns = row.querySelectorAll(".delete-btn");
    deleteBtns.forEach((approveBtn) => {
      approveBtn.addEventListener("click", async (e) => {
        const productId = e.target.dataset.id;
        const modal = document.createElement("div");
        modal.className = "modal modern-popup";
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
        document.getElementById("overlay").style.display = "block";
        document
          .getElementById("delete-confirm")
          .addEventListener("click", async () => {
            const productId = e.target.dataset.id;
            deleteProduct(productId);
            document.body.removeChild(modal);
            document.getElementById("overlay").style.display = "none";
          });

        document
          .getElementById("delete-cancel")
          .addEventListener("click", () => {
            document.body.removeChild(modal);
            document.getElementById("overlay").style.display = "none";
          });
      });
    });
  });
}

async function deleteProduct(productId) {
  try {
    const response = await fetch(
      `${PRODUCT_API_BASE_URL}/products/${productId}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error(
        `Failed to delete product: ${response.status} ${response.statusText}`
      );
    }
    const products = await fetchProducts();
    filteredProducts = products;
    totalProducts = products.length;
    updatePagination();
  } catch (error) {
    alert("Failed to delete product. Please try again.");
  }
}

async function approveProduct(productId) {
  try {
    const response = await fetch(
      `${PRODUCT_API_BASE_URL}/products/${productId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Approved" }),
      }
    );
    if (!response.ok) {
      throw new Error(
        `Failed to approve product: ${response.status} ${response.statusText}`
      );
    }
    const products = await fetchProducts();
    filteredProducts = products;
  } catch (error) {
    alert("Failed to approve product. Please try again.");
  }
}
function getPendingProductsCount(products) {
  return products.filter((product) => product.status === "Pending").length;
}
function updatePendingProductsCount(total) {
  console.log("total pending", total);
  const pendingCount = getPendingProductsCount(products);
  document.getElementById("Pending-Approval").textContent = pendingCount;
}
document.addEventListener("DOMContentLoaded", async () => {
  products = await fetchProducts();
  filteredProducts = products;
  setupProductsSearch();
  totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  displayPaginationButtons(totalPages);
  updatePagination();
  updateTotalProductsCount(totalProducts);
  updatePendingProductsCount(totalProducts);
});
