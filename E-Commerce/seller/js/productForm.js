const API_BASE_URL = "http://localhost:3000";
const SELLER_ID = "5";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("productForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let valid = true;
    // Validate name
    const nameInput = document.getElementById("productName");
    const nameGroup = nameInput.closest('.form-group');
    if (nameInput.value.trim().length < 2 || nameInput.value.trim().length > 50) {
      nameGroup.classList.add('invalid');
      valid = false;
    } else {
      nameGroup.classList.remove('invalid');
    }
    // Validate category
    const categoryInput = document.getElementById("productCategory");
    const categoryGroup = categoryInput.closest('.form-group');
    if (categoryInput.value.trim().length < 2 || categoryInput.value.trim().length > 30) {
      categoryGroup.classList.add('invalid');
      valid = false;
    } else {
      categoryGroup.classList.remove('invalid');
    }
    // Validate price
    const priceInput = document.getElementById("productPrice");
    const priceGroup = priceInput.closest('.form-group');
    if (!priceInput.value || parseFloat(priceInput.value) <= 0) {
      priceGroup.classList.add('invalid');
      valid = false;
    } else {
      priceGroup.classList.remove('invalid');
    }
    if (!valid) return;
    const name = nameInput.value;
    const category = categoryInput.value;
    const price = parseFloat(priceInput.value);
    const editId = form.getAttribute("data-edit-id");
    let product = { name, category, price };
    let method, url;
    if (editId) {
      method = "PATCH";
      url = `${API_BASE_URL}/products/${editId}`;
    } else {
      method = "POST";
      url = `${API_BASE_URL}/products`;
      product.sellerId = SELLER_ID;
      product.status = "Pending";
    }
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });
    document.getElementById("productModal").style.display = "none";
    // Show success message
    const msg = document.getElementById("successMessage");
    msg.style.display = "block";
    msg.style.animation = "fadeInOut 2.5s forwards";
    setTimeout(() => {
      msg.style.display = "none";
      location.reload();
    }, 2500);
  });
}); 