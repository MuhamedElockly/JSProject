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
        modal.style.display = "flex";
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
            // Show success message
            const successDiv = document.getElementById("successMessage");
            if (successDiv) {
              successDiv.textContent = "Product approved successfully!";
              successDiv.style.display = "block";
              setTimeout(() => {
                successDiv.style.display = "none";
              }, 2500);
            }
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
    deleteBtns.forEach((deleteBtn) => {
      deleteBtn.addEventListener("click", async (e) => {
        const productId = e.target.dataset.id;
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
        document.getElementById("overlay").style.display = "block";

        document
          .getElementById("delete-confirm")
          .addEventListener("click", async () => {
            await deleteProduct(productId);
            document.body.removeChild(modal);
            document.getElementById("overlay").style.display = "none";
            // Show success message
            const successDiv = document.getElementById("successMessage");
            if (successDiv) {
              successDiv.textContent = "Product deleted successfully!";
              successDiv.style.display = "block";
              setTimeout(() => {
                successDiv.style.display = "none";
              }, 2500);
            }
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
    // Optionally, show a user-friendly error message here
    // alert("Failed to approve product. Please try again.");
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

document.addEventListener("DOMContentLoaded", function () {
  const addProductBtn = document.getElementById("addProductBtn");
  const productModal = document.getElementById("productModal");
  const closeModal = document.getElementById("closeModal");
  if (addProductBtn && productModal && closeModal) {
    addProductBtn.addEventListener("click", () => {
      productModal.style.display = "flex";
    });
    closeModal.addEventListener("click", () => {
      productModal.style.display = "none";
    });
    productModal.addEventListener("click", (e) => {
      if (e.target === productModal) {
        productModal.style.display = "none";
      }
    });
  }

  // Add Product Modal Validation and Submission
  const form = document.getElementById("productForm");
  const nameInput = document.getElementById("productName");
  const categoryInput = document.getElementById("productCategory");
  const priceInput = document.getElementById("productPrice");
  const photoInput = document.getElementById("productPhoto");
  const photoPreview = document.getElementById("photoPreview");
  const browseBtn = document.getElementById("browseImageBtn");
  const browseInput = document.getElementById("browseImageInput");
  const PRODUCT_API_URL = "http://localhost:3000";
  const CURRENT_SELLER_ID = "5";

  function validateField(input, errorMessage) {
    const formGroup = input.closest(".form-group");
    const errorSpan = formGroup.querySelector(".error-message");
    if (input.type === "number") {
      if (!input.value || parseFloat(input.value) <= 0) {
        formGroup.classList.add("invalid");
        errorSpan.textContent = errorMessage;
        return false;
      }
    } else {
      if (
        !input.value.trim() ||
        input.value.trim().length < 2 ||
        input.value.trim().length > (input.id === "productName" ? 50 : 30)
      ) {
        formGroup.classList.add("invalid");
        errorSpan.textContent = errorMessage;
        return false;
      }
    }
    formGroup.classList.remove("invalid");
    return true;
  }

  if (form) {
    validateField(nameInput, "Product name is required (2-50 characters)");
    validateField(categoryInput, "Category is required (2-30 characters)");
    validateField(priceInput, "Price must be greater than 0");

    nameInput.addEventListener("input", () =>
      validateField(nameInput, "Product name is required (2-50 characters)")
    );
    categoryInput.addEventListener("input", () =>
      validateField(categoryInput, "Category is required (2-30 characters)")
    );
    priceInput.addEventListener("input", () =>
      validateField(priceInput, "Price must be greater than 0")
    );

    // Image URL preview functionality
    photoInput.addEventListener("input", function () {
      const url = this.value.trim();
      if (url) {
        photoPreview.src = url;
        photoPreview.style.display = "block";
      } else {
        photoPreview.src = "";
        photoPreview.style.display = "none";
      }
    });

    browseBtn.addEventListener("click", () => {
      browseInput.click();
    });

    browseInput.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        const url = `/images/product-images/${file.name}`;
        photoInput.value = url;
        // Optionally trigger input event for preview
        photoInput.dispatchEvent(new Event('input'));
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const isNameValid = validateField(
        nameInput,
        "Product name is required (2-50 characters)"
      );
      const isCategoryValid = validateField(
        categoryInput,
        "Category is required (2-30 characters)"
      );
      const isPriceValid = validateField(
        priceInput,
        "Price must be greater than 0"
      );
      const photoUrl = photoInput.value.trim();
      const photoError = photoInput.closest(".form-group").querySelector(".error-message");
      let isPhotoValid = true;
      if (!photoUrl) {
        photoInput.closest(".form-group").classList.add("invalid");
        photoError.textContent = "Please enter the image URL.";
        isPhotoValid = false;
      } else {
        photoInput.closest(".form-group").classList.remove("invalid");
        photoError.textContent = "";
      }
      if (!isNameValid || !isCategoryValid || !isPriceValid || !isPhotoValid) {
        return;
      }
      const product = {
        name: nameInput.value.trim(),
        category: categoryInput.value.trim(),
        price: parseFloat(priceInput.value),
        sellerId: CURRENT_SELLER_ID,
        status: "Pending",
        imageUrl: photoUrl,
      };
      try {
        const response = await fetch(PRODUCT_API_URL + "/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        });
        if (!response.ok) {
          throw new Error("Failed to save product");
        }
        document.getElementById("productModal").style.display = "none";
        const msg = document.getElementById("successMessage");
        const overlay = document.getElementById("successOverlay");
        msg.textContent = "Product added successfully!";
        msg.style.display = "block";
        overlay.style.display = "block";
        msg.style.animation = "fadeInOut 2.5s forwards";
        setTimeout(() => {
          msg.style.display = "none";
          overlay.style.display = "none";
        }, 2500);
        form.reset();
        form.querySelectorAll(".form-group").forEach((group) => group.classList.remove("invalid"));
        photoPreview.src = "";
        photoPreview.style.display = "none";
      } catch (error) {
        alert("Failed to save product. Please try again.");
      }
    });
  }
});
