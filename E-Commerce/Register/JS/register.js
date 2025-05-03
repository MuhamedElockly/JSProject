window.addEventListener("load", () => {
  let registerBtn = document.getElementById("submit-btn");
  addListenerToAll();
  registerBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let colorValid = isColorValid();
    let genderValid = isGenderValid();
    let ageValid = isAgeValid();
    let nameValid = isNameValid();
    // console.log("clicked register");
    if (ageValid && colorValid && genderValid && nameValid) {
      storeAtLocalStorage();
      const newTap = window.open("user.html", "");
    }
  });
});
