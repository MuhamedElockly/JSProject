const isGenderValid = () => {
  let genderInputFeild = document.getElementsByClassName("gender")[0];
  let genderMale = document.getElementById("male");
  let genderFemale = document.getElementById("female");
  let genderErorr = document.getElementById("user-gender-error");
  if (!genderMale.checked && !genderFemale.checked) {
    genderInputFeild.style.border = "2px solid red";
    genderErorr.style.display = "inline-block";
    genderInputFeild.focus();
    return false;
  } else {
    genderInputFeild.style.border = "none";
    genderErorr.style.display = "none";
    return true;
  }
};
const isColorValid = () => {
  let colorInputFeild = document.getElementsByClassName("color-select")[0];
  let colorErorr = document.getElementById("user-color-error");
  let selectedColor = document.getElementById("color-select");
  if (selectedColor.selectedIndex == 0) {
    colorInputFeild.style.border = "2px solid red";
    colorErorr.style.display = "inline-block";
    colorInputFeild.focus();
    return false;
  } else {
    colorInputFeild.style.border = "none";
    colorErorr.style.display = "none";
    return true;
  }
};
// const isAgeValid = () => {
//   let ageInputFeild = document.getElementById("user-age");
//   let ageErorr = document.getElementById("user-age-error");
//   if (ageInputFeild.value == "") {
//     ageInputFeild.style.border = "2px solid red";
//     ageErorr.innerText = "This feild required";
//     ageErorr.style.display = "inline-block";
//     ageInputFeild.focus();
//     return false;
//   } else if (ageInputFeild.value < 20 || ageInputFeild.value > 60) {
//     ageInputFeild.style.border = "2px solid red";
//     ageErorr.innerText = "Age must be in (20-60)!";
//     ageErorr.style.display = "inline-block";
//     ageInputFeild.focus();
//     return false;
//   } else {
//     ageInputFeild.style.border = "2px solid #023047";
//     ageErorr.style.display = "none";
//     return true;
//   }
// };
const isNameValid = () => {
  let nameInputFeild = document.getElementById("user-name");
  let nameErorr = document.getElementById("user-name-error");
  if (nameInputFeild.value == "") {
    nameInputFeild.style.border = "2px solid red";
    nameErorr.style.display = "inline-block";
    nameInputFeild.focus();
    return false;
  } else {
    nameInputFeild.style.border = "2px solid #023047";
    nameErorr.style.display = "none";
    return true;
  }
};
const addListenerToAll = () => {
  let genderMale = document.getElementById("male");
  let genderFemale = document.getElementById("female");
  let selectedColor = document.getElementById("color-select");
  let ageInputFeild = document.getElementById("user-age");
  let nameInputFeild = document.getElementById("user-name");
  let isMaleCheckd = false;
  let isFemaleCheckd = false;
  nameInputFeild.addEventListener("change", () => {
    isNameValid();
  });
  // ageInputFeild.addEventListener("change", () => {
  //   isAgeValid();
  // });
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
  genderMale.addEventListener("change", (e) => {
    isGenderValid();
  });
  genderFemale.addEventListener("change", (e) => {
    isGenderValid();
  });
  selectedColor.addEventListener("change", () => {
    isColorValid();
  });
};

const storeAtLocalStorage = () => {
  let nameInputFeild = document.getElementById("user-name");
  let ageInputFeild = document.getElementById("user-age");
  let selectedColor = document.getElementById("color-select");
  let userName = nameInputFeild.value;
  let userAge = ageInputFeild.value;
  let userColor = selectedColor.options[selectedColor.selectedIndex].value;
  let genderMale = document.getElementById("male");
  let genderFemale = document.getElementById("female");
  let userGender = "";
  if (genderMale.checked) {
    userGender = "male";
  } else {
    userGender = "female";
  }
  const user = {
    name: userName,
    age: userAge,
    color: userColor,
    gender: userGender,
  };
  localStorage.setItem("user", JSON.stringify(user));
  const savedData = localStorage.getItem("user");
  alert("Data saved successfully!");
};
