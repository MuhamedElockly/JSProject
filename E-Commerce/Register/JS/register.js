import {
  isGenderValid,
  isRoleValid,
  isNameValid,
  isConfirmPasswordValid,
  addListenerToAll,
  isFirstNameValid,
  isLastNameValid,
  isEmailValid,
  isPasswordValid,
  collectFormData
} from "./utils.js";

// Initialize sample users if localStorage is empty
if (!localStorage.getItem("users")) {
  fetch("JS/users.json")
    .then(response => response.json())
    .then(data => {
      localStorage.setItem("users", JSON.stringify(data.users));
    })
    .catch(error => console.error("Error loading sample users:", error));
}

window.addEventListener("load", () => {
  let registerBtn = document.getElementById("submit-btn");
  addListenerToAll();
  registerBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    let firstNameValid = isFirstNameValid();
    let lastNameValid = isLastNameValid();
    let emailValid = isEmailValid();
    let passwordValid = isPasswordValid();
    let confirmPasswordValid = isConfirmPasswordValid();
    let genderValid = isGenderValid();
    let validRole = isRoleValid();

    if (
      firstNameValid &&
      lastNameValid &&
      emailValid &&
      passwordValid &&
      confirmPasswordValid &&
      genderValid &&
      validRole
    ) {
      const userData = await collectFormData();
      if (userData) {
        console.log("User registered successfully:", userData);
        // You can redirect to another page or do something else here
      }
    }
  });
});
