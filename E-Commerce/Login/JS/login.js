window.addEventListener("load", function () {
  document.getElementById("add-user-form")
    .addEventListener("submit", async function (event) {
      event.preventDefault(); // Prevent form submission

      const email = document.getElementById("email").value?.trim();
      const password = document.getElementById("password").value?.trim();
      const emailError = document.getElementById("email-error");
      const passwordError = document.getElementById("user-name-error");
      let isValid = true;

      if (!email) {
        emailError.style.visibility = "visible";
        emailError.textContent = "Email is required";
        emailError.style.color = "red";

        document.getElementById("email").style.borderColor = "red";
        isValid = false;
      } else {
        document.getElementById("email").style.borderColor = "green";
      }

      if (!password) {
        passwordError.style.visibility = "visible";
        passwordError.textContent = "Password is required";
        passwordError.style.color = "red";
        document.getElementById("password").style.borderColor = "red";
        isValid = false;
      } else {
        document.getElementById("password").style.borderColor = "green";
      }

      if (!isValid) {
        return;
      }

      try {
        const response = await fetch("../DataBase/db.json");
        const data = await response.json();

        const user = data.users.find(
          (user) => user.email === email && user.password === password
        );

        if (user) {
          // Show success message
          alert(`Login successful! Welcome ${user.firstName} ${user.lastName}`);
          document.getElementById("email").style.borderColor = "green";
          document.getElementById("password").style.borderColor = "green";

          // Store user info in localStorage
          localStorage.setItem(
            "User",
            JSON.stringify({
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              role: user.role,
              gender:user.gender
            })
          );

          // Redirect based on user role
          switch (user.role) {
            case "admin":
              window.location.href = "../Admin-Panel/Admin.html";
              break;
            case "seller":
              window.location.href = "../seller/SellerDashboard.html";
              break;
            case "customer":
              window.location.href = "../index.html";
              break;
            default:
              alert("Unknown user role. Please contact support.");
          }
        } else {
          // Show failure message
          alert("Login failed - Invalid email or password");
          document.getElementById("email").style.borderColor = "red";
          document.getElementById("password").style.borderColor = "red";
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Error connecting to database");
        document.getElementById("email").style.borderColor = "red";
      }
    });
});
