const PRODUCT_API_BASE_URL = "http://localhost:3000"; // Change this to match your backend URL

let productCurrentPage = 1;
let productsPerPage = 5;
let totalProducts = 0;
let filteredProducts = [];
let products = [];

async function fetchProducts() {
  console.log('products')
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

function displayPaginationButtons(totalPages) {

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
  const totalPages = Math.ceil(products.length / productsPerPage);
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
  const currentPageProducts = products.slice(startIndex, endIndex);
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
      <td>
        <button class="action-btn approve-btn" data-id="${product.id}">Approve</button>
        <button class="action-btn delete-btn" data-id="${product.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
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
    // const totalPages = Math.ceil(totalProducts / productsPerPage);
    // displayPaginationButtons(totalPages);
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

document.addEventListener("DOMContentLoaded", async () => {
 
     products = await fetchProducts();
    console.log('dfsddddddddddddddddf')
    totalProducts = products.length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    displayPaginationButtons(totalPages);
    updatePagination();
    updateTotalProductsCount(totalProducts)

  

  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const productId = e.target.dataset.id;
      if (confirm("Are you sure you want to delete this product?")) {
        await deleteProduct(productId);
      }
    } else if (e.target.classList.contains("approve-btn")) {
      const productId = e.target.dataset.id;
      if (confirm("Are you sure you want to approve this product?")) {
        await approveProduct(productId);
      }
    }
  });
});
