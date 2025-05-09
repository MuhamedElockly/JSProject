const PRODUCT_API_URL = "http://localhost:3000";
const CURRENT_SELLER_ID = "5";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("productForm");

  const nameInput = document.getElementById("productName");
  const categoryInput = document.getElementById("productCategory");
  const priceInput = document.getElementById("productPrice");
  const photoInput = document.getElementById("productPhoto");
  const photoPreview = document.getElementById("photoPreview");
  const browseBtn = document.getElementById("browseImageBtn");
  const browseInput = document.getElementById("browseImageInput");

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

      // photoInput.dispatchEvent(new Event('input'));
    }
  });

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
    const photoError = photoInput
      .closest(".form-group")
      .querySelector(".error-message");
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
      msg.style.display = "block";
      msg.style.animation = "fadeInOut 2.5s forwards";

      form.reset();
      form
        .querySelectorAll(".form-group")
        .forEach((group) => group.classList.remove("invalid"));
      photoPreview.src = "";
      photoPreview.style.display = "none";
    } catch (error) {
      alert("Failed to save product. Please try again.");
    }
  });
});
