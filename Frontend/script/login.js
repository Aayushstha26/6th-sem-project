
function updateNavbar() {
  const rightPart = document.querySelector(".right_part");
  const username = localStorage.getItem("username");

  if (username) {
    // User is logged in
    rightPart.innerHTML = `
      <div class="user-info">
        <span class="welcome">Welcome, ${username}</span>
        <button id="logoutBtn" class="logout-btn">Logout</button>
      </div>
    `;

    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("username");
      localStorage.removeItem("accessToken");
      updateNavbar(); // refresh navbar
    });
  } else {
    // User not logged in
    rightPart.innerHTML = `
      <div class="cart" id="cart">
        <a href="">
          <img id="s_cart" src="../images/ShoppingCart.png" alt="AAVA" />
        </a>
      </div>
      <div class="profile" id="profile">
        <a href="">
          <div class="log"><span>Login</span></div>
          <div class="regs" id="regs"><span>Register</span></div>
        </a>
      </div>
    `;

    // Reattach popup event listeners
    attachLoginRegisterHandlers();
  }
}

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  let message = document.getElementById("results");
  let Email = document.getElementById("Email");
  let Password = document.getElementById("Password");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (checkLoginForm()) {
      // form.submit();
      const formData = {
        Email: Email.value,
        Password: Password.value,
      };

      try {
        const res = await fetch("http://localhost:4000/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const result = await res.json();
          if (res.ok) {
            message.innerHTML = result.message;
            showSucess();
            form.reset();
      // alert("Login successful!");
      console.log("Access Token:", data.accessToken);
      const decoded = parseJwt(data.accessToken);
      console.log("Decoded Token:", decoded);

      // Save username in localStorage
      localStorage.setItem("username", decoded.username);

      // Redirect to homepage
      window.location.href = "/";

      // Example: access user's name
      console.log("User Name:", decoded.username);
    } else {
      alert(data.message || "Login failed");
    }
        // alert(result.message);
      } catch (err) {
        // alert("Registration failed. See console.");
        message.innerHTML = "Error!! Something went wrong";
        console.error(err);
      }
    }
  });

  Email.addEventListener("input", () => {
    checkValid(
      Email,
      Email.value.trim() !== "" && isEmail(Email.value.trim()),
      "Not a valid email"
    );
  });
  Password.addEventListener("input", () => {
    checkValid(
      Password,
      Password.value.trim().length >= 8,
      "Password must be atleast 8 "
    );
  });
  function checkLoginForm() {
    let isValid = true;
    checkValid(
      Email,
      Email.value.trim() !== "" && isEmail(Email.value.trim()),
      "Not a valid email"
    );
    checkValid(
      Password,
      Password.value.trim().length >= 8,
      "Password must be at least 8 characters"
    );
    // checkValid(checkbox, checkbox.checked, "You must agree to the terms.");

    document.querySelectorAll("#loginForm .formContent").forEach((control) => {
      if (control.classList.contains("error")) {
        isValid = false;
      }
    });
    return isValid;
  }
  function checkValid(input, condition, errormessage) {
    if (condition) {
      Success(input);
    } else {
      setError(input, errormessage);
    }
  }
  function Success(input) {
    console.log("Sucess");
    const formContent = input.parentElement;
    const icon = formContent.querySelector(".icon");
    const errorMsg = formContent.querySelector(".errorMsg");
    formContent.className = "formContent success";
    icon.className = "formContent icon fas fa-check-circle";
    if (errorMsg) {
      errorMsg.innerHTML = "";
    }
  }
  function setError(input, errormessage) {
    console.log("Error");
    const formContent = input.parentElement;
    const icon = formContent.querySelector(".icon");
    const errorMsg = formContent.querySelector(".errorMsg");
    formContent.classList = "formContent error";
    icon.className = "formContent icon fas fa-times-circle ";
    if (errorMsg) {
      errorMsg.innerHTML = errormessage;
    }
  }
  function isEmail(email) {
    // return /^[a-zA-Z._-]+@[a-zA-Z]+\.[a-zA-Z]{2,6}$/.test(email);
    return /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z]+\.[a-zA-Z]{2,}$/.test(email);
  }

  function showSucess() {
    const modal = document.getElementById("success");
    modal.style.display = "block";

    closeBtn = document.getElementById("close-btn");
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });
  }
});
