export const isGenderValid = () => {
    let genderInputFeild = document.getElementsByClassName("gender")[0];
    let genderMale = document.getElementById("male");
    let genderFemale = document.getElementById("female");
    let genderErorr = document.getElementById("user-gender-error");
    if (!genderMale.checked && !genderFemale.checked) {
      genderInputFeild.style.borderColor = "red";
      genderErorr.style.display = "block";
      genderErorr.style.visibility = "visible";

      genderInputFeild.focus();
      return false;
    } else {
    //   genderInputFeild.style.border = "none";
    //   genderErorr.style.display = "none";
      genderErorr.style.visibility = "hidden";
      return true;
    }
  };
  
  export const isRoleValid = () => {
    let roleInputFeild = document.getElementsByClassName("role-select")[0];
    let roleErorr = document.getElementById("user-role-error");
    let selectedRole = document.getElementById("role-select");
    if (selectedRole.selectedIndex == 0) {
      roleInputFeild.style.borderColor = "red";
      // roleErorr.style.display = "block";
      roleErorr.style.visibility = "visible";

      roleInputFeild.focus();
      return false;
    } else {
      roleInputFeild.style.borderColor = "green";
    //   roleErorr.style.display = "none";
      roleErorr.style.visibility = "hidden";
      return true;
    }
  };
  
  // const isAgeValid = () => {
  //   let ageInputFeild = document.getElementById("user-age");
  //   let ageErorr = document.getElementById("user-age-error");
  //   if (ageInputFeild.value == "") {
  //     ageInputFeild.style.border = "2px solid red";
  //     ageErorr.innerText = "This feild required";
  //     ageErorr.style.display = "block";
  //     ageInputFeild.focus();
  //     return false;
  //   } else if (ageInputFeild.value < 20 || ageInputFeild.value > 60) {
  //     ageInputFeild.style.border = "2px solid red";
  //     ageErorr.innerText = "Age must be in (20-60)!";
  //     ageErorr.style.display = "block";
  //     ageInputFeild.focus();
  //     return false;
  //   } else {
  //     ageInputFeild.style.border = "2px solid #023047";
  //     ageErorr.style.display = "none";
  //     return true;
  //   }
  // };
  
//   export const isNameValid = () => {
//     let nameInputFeild = document.getElementById("user-name");
//     let nameErorr = document.getElementById("user-name-error");
//     if (nameInputFeild.value == "") {
//       nameInputFeild.style.border = "2px solid red";
//     //   nameErorr.style.display = "block";
//       nameErorr.style.visibility = "visible";

//       nameInputFeild.focus();
//       return false;
//     } else {
//       nameInputFeild.style.border = "2px solid #023047";
//     //   nameErorr.style.display = "none";
//       nameErorr.style.visibility = "hidden";

//       return true;
//     }
//   };
  
  export const isFirstNameValid = () => {
    const firstNameInput = document.getElementById("first-name");
    const firstNameError = document.getElementById("fname-error");
    if (firstNameInput.value?.trim() == "" || firstNameInput.value?.trim() == null) {
      firstNameInput.style.borderColor = "red";
    //   firstNameError.style.display = "block";
      firstNameError.style.visibility = "visible";
      firstNameError.textContent = "First name is required";
      firstNameInput.focus();
      return false;
    } else if (firstNameInput.value?.trim().length < 3) {
      firstNameInput.style.borderColor = "red";
      firstNameError.style.display = "block";
      firstNameError.style.visibility = "visible";
      firstNameError.textContent = "First name must be at least 3 characters";
      firstNameInput.focus();
      return false;
    } else {
      firstNameInput.style.borderColor = "green";
    //   firstNameError.style.display = "none";
    firstNameError.style.visibility = "hidden";

      return true;
    }
  };
  
  export const isLastNameValid = () => {
    let lastNameInput = document.getElementById("last-name");
    let lastNameError = document.getElementById("lname-error");
  
    if (lastNameInput.value.trim() === "") {
      lastNameInput.style.borderColor = "red";
      lastNameError.style.display = "block";
      lastNameError.style.visibility = "visible";
      lastNameError.textContent = "Last name is required";
      lastNameInput.focus();
      return false;
    } else if (lastNameInput.value.trim().length < 3) {
      lastNameInput.style.borderColor = "red";
      lastNameError.style.display = "block";
      lastNameError.style.visibility = "visible";

      lastNameError.textContent = "Last name must be at least 3 characters";
      lastNameInput.focus();
      return false;
    } else {
      lastNameInput.style.borderColor = "green";
    //   lastNameError.style.display = "none";
        lastNameError.style.visibility = "hidden";

      return true;
    }
  };
  export const isPasswordValid = () => {
    let passwordInput = document.getElementById("password");
    let passwordError = document.getElementById("password-error");
  
    if (passwordInput.value.trim() === "") {
      passwordInput.style.borderColor = "red";
      passwordError.style.display = "block";
      passwordError.style.visibility = "visible";
      passwordError.textContent = "Password feild is required";
      passwordInput.focus();
      return false;
    } else if (passwordInput.value.trim().length < 3) {
      passwordInput.style.borderColor = "red";
      passwordError.style.display = "block";
      passwordError.style.visibility = "visible";
      passwordError.textContent = "Password must be at least 3 characters";
      passwordInput.focus();
      return false;
    } else {
      passwordInput.style.borderColor = "green";
    //   passwordError.style.display = "none";
        passwordError.style.visibility = "hidden";

      return true;
    }
  };
  export const isConfirmPasswordValid = () => {
    let passwordInput = document.getElementById("password");
  
    let confirmPasswordInput = document.getElementById("confirm-password");
    let confirmPasswordError = document.getElementById("confirm-password-error");
    let passwordValue = passwordInput.value;
    let confirmPasswordValue = confirmPasswordInput.value;
  
    if (confirmPasswordInput.value.trim() === "") {
      confirmPasswordInput.style.borderColor = "red";;
      confirmPasswordError.style.display = "block";
      confirmPasswordError.style.visibility = "visible";
      
      confirmPasswordError.textContent = "Password feild is required";
      confirmPasswordInput.focus();
      return false;
    } else if (confirmPasswordValue != passwordValue) {
      confirmPasswordInput.style.borderColor = "red";
      confirmPasswordError.style.display = "block";
      confirmPasswordError.style.visibility = "visible";

      confirmPasswordError.textContent = "Password doesn't match!";
      confirmPasswordInput.focus();
      return false;
    } else {
      confirmPasswordInput.style.borderColor = "green";
    //   confirmPasswordError.style.display = "none";
        confirmPasswordError.style.visibility = "hidden";

      return true;
    }
  };
  export const isEmailValid = () => {
    let emailInput = document.getElementById("email");
    let emailError = document.getElementById("email-error");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (emailInput.value.trim() === "") {
      emailInput.style.borderColor = "red";
      emailError.style.display = "block";
      emailError.style.visibility = "visible";
      emailError.textContent = "Email is required";
      emailInput.focus();
      return false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      emailInput.style.borderColor = "red";
      emailError.style.visibility = "visible";

      emailError.textContent = "Please enter a valid email address";
      emailInput.focus();
      return false;
    } else {
      emailInput.style.borderColor = "green";
    //   emailError.style.display = "none";
      emailError.style.visibility = "hidden";
      return true;
    }
  };
  
  export const addListenerToAll = () => {
    let genderMale = document.getElementById("male");
    let genderFemale = document.getElementById("female");
    let selectedRole = document.getElementById("role-select");
    let firstNameInputFeild = document.getElementById("first-name");
    let lastNameInputFeild = document.getElementById("last-name");
    let emailInputFeild = document.getElementById("email");
    let passwordInput = document.getElementById("password");
    let confirmPasswordInput = document.getElementById("confirm-password");
  
    let isMaleCheckd = false;
    let isFemaleCheckd = false;
    firstNameInputFeild.addEventListener("blur", () => {
      isFirstNameValid();
    });
    lastNameInputFeild.addEventListener("blur", () => {
      isLastNameValid();
    });
    emailInputFeild.addEventListener("blur", () => {
      isEmailValid();
    });
    passwordInput.addEventListener("blur", () => {
      isPasswordValid();
    });
    confirmPasswordInput.addEventListener("blur", () => {
      isConfirmPasswordValid();
    });
    genderMale.addEventListener("click", (e) => {
      if (isMaleCheckd) {
        genderMale.checked = false;
        isMaleCheckd = false;
      } else {
        isFemaleCheckd = false;
        genderMale.checked = true;
        isMaleCheckd = true;
      }
    });
    genderFemale.addEventListener("click", () => {
      if (isFemaleCheckd) {
        genderFemale.checked = false;
        isFemaleCheckd = false;
      } else {
        isMaleCheckd = false;
        genderFemale.checked = true;
        isFemaleCheckd = true;
      }
    });
    genderMale.addEventListener("blur", (e) => {
      isGenderValid();
    });
    genderFemale.addEventListener("blur", (e) => {
      isGenderValid();
    });
    selectedRole.addEventListener("blur", () => {
      isRoleValid();
    });
  };
  
  const API_URL = "http://localhost:3000";
  
  export const checkUserExists = async (email) => {
    try {
      const response = await fetch(`${API_URL}/users?email=${email}`);
      const users = await response.json();
      return users.length > 0;
    } catch (error) {
      console.error("Error checking user:", error);
      return false;
    }
  };
  
  export const addNewUser = async (userData) => {
    try {
      const exists = await checkUserExists(userData.email);
      if (exists) {
        alert("User with this email already exists!");
        return false;
      }
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add user");
      }
      alert("Registration successful!");
      return true;
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Error during registration. Please try again.");
      return false;
    }
  };
  
  export const collectFormData = async () => {
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const role = document.getElementById("role-select").value;
  
    const user = {
      firstName,
      lastName,
      email,
      password,
      gender,
      role,
    };
    if (await addNewUser(user)) {
      return user;
    }
    return null;
  };