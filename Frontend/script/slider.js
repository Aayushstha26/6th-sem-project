let slideIndex = 0;
const slides = document.querySelectorAll(".slide");

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === index) slide.classList.add("active");
  });
}

function nextSlide() {
  slideIndex = (slideIndex + 1) % slides.length;
  showSlide(slideIndex);
}

function prevSlide() {
  slideIndex = (slideIndex - 1 + slides.length) % slides.length;
  showSlide(slideIndex);
}

setInterval(nextSlide, 5000);

// popup register//

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    updateNavbar();
  }
  const regs = document.getElementById("regs");
  const registerModal = document.getElementById("registerModal");
  const registerContent = document.getElementById("registerContent");

  regs.addEventListener("click", (e) => {
    e.preventDefault();

    fetch("/signup")
      .then((reg) => reg.text())
      .then((data) => {
        registerContent.innerHTML = data;
        console.log(data);
        registerModal.style.display = "flex";

        const form = document.getElementById("registerForm");
        let message = document.getElementById("results");
        let Firstname = document.getElementById("Firstname");
        let Lastname = document.getElementById("Lastname");
        let Phone = document.getElementById("Phone");
        let Email = document.getElementById("Email");
        let Password = document.getElementById("Password");

        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          console.log(Firstname);
          if (checkRegisterForm()) {
            console.log(form);
            // form.submit();
            const formData = {
              Firstname: Firstname.value,
              Lastname: Lastname.value,
              Phone: Phone.value,
              Email: Email.value,
              Password: Password.value,
            };

            try {
              const res = await fetch("http://localhost:4000/user/register", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
              });

              const result = await res.json();
              // alert(result.message);
              message.innerHTML = result.message;
              showSucess();
              form.reset();
            } catch (err) {
              // alert("Registration failed. See console.");
              message.innerHTML = "Error!! Something went wrong";
              console.error(err);
            }
          }
        });
        Firstname.addEventListener("input", () => {
          checkValid(
            Firstname,
            Firstname.value.trim() !== "" && isName(Firstname.value.trim()),
            "Firstname msut be atleast 3 character"
          );
        });
        Lastname.addEventListener("input", () => {
          checkValid(
            Lastname,
            Lastname.value.trim() !== "" && isName(Lastname.value.trim()),
            "Lastname  msut be atleast 3 character"
          );
        });
        Phone.addEventListener("input", () => {
          checkValid(
            Phone,
            Phone.value.trim() !== "" && isPhone(Phone.value.trim()),
            "Not a valid phone"
          );
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
        function checkRegisterForm() {
          let isValid = true;
          checkValid(
            Firstname,
            Firstname.value.trim() !== "" && isName(Firstname.value.trim()),
            "Firstname can't be blank"
          );
          checkValid(
            Lastname,
            Lastname.value.trim() !== "" && isName(Lastname.value.trim()),
            "Lastname can't be blank"
          );
          checkValid(
            Phone,
            Phone.value.trim() !== "" && isPhone(Phone.value.trim()),
            "Not a valid phone"
          );
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

          document
            .querySelectorAll("#Register-form .formContent")
            .forEach((control) => {
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
          return /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z]+\.[a-zA-Z]{2,}$/.test(
            email
          );
        }
        function isName(name) {
          return /^[a-zA-Z\s]{3,}$/.test(name);
        }

        function isPhone(phone) {
          return /^\d{10}$/.test(phone);
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

        const closebtn = registerContent.querySelector("#close-btn");
        if (closebtn) {
          closebtn.addEventListener("click", () => {
            registerModal.style.display = "none";
          });
        }

        window.addEventListener("click", (e) => {
          if (e.target === registerModal) {
            registerModal.style.display = "none";
          }
        });
      });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  let log = document.querySelector(".log");
  let loginModal = document.getElementById("loginModal");
  let loginContent = document.getElementById("loginContent");
  let cart = document.getElementById("cart");
  // Get elements
  const searchBox = document.getElementById("searchBox");
  const searchBtn = document.getElementById("searchBtn");

  // Search event listeners
  searchBox.addEventListener("input", (e) => {
    const searchTerm = e.target.value.trim();
    if (searchTerm.length > 0) {
      search(searchTerm);
    } else {
      clearResults();
    }
  });

  searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const searchTerm = searchBox.value.trim();
    if (searchTerm.length === 0) {
      alert("Please enter a search term.");
      return;
    }
    search(searchTerm);
  });

  async function search(searchTerm) {
    const resultsContainer = document.getElementById("results-container");

    // Show loading state
    resultsContainer.innerHTML =
      '<div class="results-loading">Searching...</div>';

    try {
      const res = await fetch(`http://localhost:4000/product/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search: searchTerm }),
      });

      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();
      console.log("Search results:", data);

      // Check if data is wrapped in an object (common API pattern)
      let results = data;

      // Handle different API response formats
      if (data.products) {
        results = data.products;
      } else if (data.data) {
        results = data.data;
      } else if (data.results) {
        results = data.results;
      } else if (!Array.isArray(data)) {
        // If it's a single object, wrap it in an array
        results = [data];
      }

      displayResults(results, searchTerm);
    } catch (error) {
      console.error("Error during search:", error);
      displayError("Failed to fetch search results. Please try again.");
    }
  }

  function displayResults(data, searchTerm) {
    const resultsContainer = document.getElementById("results-container");

    // Clear previous results
    resultsContainer.innerHTML = "";

    // Ensure data is an array
    if (!Array.isArray(data)) {
      console.error("Data is not an array:", data);
      displayError("Invalid search results format.");
      return;
    }

    // Check if there are results
    if (data.length === 0) {
      resultsContainer.innerHTML = `
            <div class="no-results">
                <p>No results found for "${searchTerm}"</p>
            </div>
        `;
      return;
    }

    // Create results list
    const resultsList = document.createElement("div");
    resultsList.className = "results-list";

    data.forEach((item) => {
      const resultItem = document.createElement("div");
      resultItem.className = "result-item";

      resultItem.innerHTML = `
            <img src="${item.productImg || item.image || "placeholder.jpg"}" 
                 alt="${item.product_name || item.name}" 
                 class="result-thumbnail"
                 onerror="this.src='placeholder.jpg'">
            <div class="result-details">
                <h3 class="result-title">${
                  item.product_name || item.name || "Unnamed Product"
                }</h3>
                <p class="result-subtitle">${
                  item.description || item.subtitle || ""
                }</p>
                <div class="result-meta">
                    ${
                      item.price
                        ? `<span class="result-price">$${item.price}</span>`
                        : ""
                    }
                    ${
                      item.category
                        ? `<span class="result-type">${item.category?.name}</span>`
                        : ""
                    }
                    ${
                      item.stock
                        ? `<span class="result-stock">${item.stock} in stock</span>`
                        : ""
                    }
                </div>
            </div>
        `;

      // Add click event to navigate to detail page
      const productId = item.id || item._id;
      resultItem.addEventListener("click", () => {
        window.location.href = `/product-details?id=${productId}`;
      });

      resultsList.appendChild(resultItem);
    });

    // Add "View all results" button
    const viewAllBtn = document.createElement("button");
    viewAllBtn.className = "view-all-btn";
    viewAllBtn.innerHTML = "View all results <span>→</span>";
    viewAllBtn.addEventListener("click", () => {
      window.location.href = `/product-page?q=${encodeURIComponent(
        searchTerm
      )}`;
    });

    resultsContainer.appendChild(resultsList);
    resultsContainer.appendChild(viewAllBtn);
  }

  function displayError(message) {
    const resultsContainer = document.getElementById("results-container");
    resultsContainer.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
        </div>
    `;
  }

  function clearResults() {
    const resultsContainer = document.getElementById("results-container");
    resultsContainer.innerHTML = "";
  }

  // Close results when clicking outside
  document.addEventListener("click", (e) => {
    const resultsContainer = document.getElementById("results-container");
    const searchBox = document.querySelector(".search-box");

    if (
      searchBox &&
      resultsContainer &&
      !searchBox.contains(e.target) &&
      !resultsContainer.contains(e.target)
    ) {
      clearResults();
    }
  });

  log.addEventListener("click", (e) => {
    e.preventDefault();
    loadLoginForm();
  });
  cart.addEventListener("click", (e) => {
    e.preventDefault();
    loadLoginForm();
  });
  function loadLoginForm() {
    fetch("/signin")
      .then((res) => res.text())
      .then((data) => {
        loginContent.innerHTML = data;
        console.log(data);
        loginModal.style.display = "flex";

        const form = document.getElementById("loginForm");
        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          const email = document.getElementById("email").value;
          const password = document.getElementById("password").value;
          console.log(email);
          try {
            const res = await fetch("http://localhost:4000/user/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ Email: email, Password: password }),
            });

            const data = await res.json();

            if (res.ok) {
              // alert("Login successful!");
              showToast("Login successful!");
              console.log("Access Token:", data.accessToken);
              const decoded = parseJwt(data.accessToken);
              console.log("Decoded Token:", decoded);

              // Example: access user's name
              localStorage.setItem("username", decoded.username);
              localStorage.setItem("accessToken", data.accessToken);
              localStorage.setItem("email", decoded.email);
              updateNavbar();
              loginModal.style.display = "none";
              console.log("User Name:", decoded.username);
            } else {
              alert(data.message || "Login failed");
            }
          } catch (err) {
            alert("Error: " + err.message);
          }
        });
        function parseJwt(token) {
          try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split("")
                .map(
                  (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                )
                .join("")
            );

            return JSON.parse(jsonPayload);
          } catch (e) {
            return null;
          }
        }

        window.addEventListener("click", (e) => {
          if (e.target === loginModal) {
            loginModal.style.display = "none";
          }
        });
      });
  }
});

function updateNavbar(showSearchBox = true) {
  const rightPart = document.querySelector(".right_part");
  const username = localStorage.getItem("username");

  // If user is NOT logged in
  if (!username) {
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
    return;
  }

  // If user IS logged in
  rightPart.innerHTML = `
    <div class="user-info">

      ${
        showSearchBox
          ? `
        <div class="search-box">
              <input
                type="search"
                id="searchBox"
                placeholder="Search for products..."
                aria-label="Search for products"
              />
              <button id="searchBtn" type="button" aria-label="Search">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </div>
            <div id="c" style="display: flex; justify-content: center; align-items: center; position: absolute; top: 60px; right: 745px;">

              <div id="results-container"></div>
            </div>
      `
          : ""
      }

      <div class="cart" id="cart">
        <a href="/cart">
          <img id="s_cart" src="../images/ShoppingCart.png" alt="AAVA" />
        </a>
      </div>

      <span class="welcome">Welcome, ${username}</span>
      <button id="logoutBtn" class="logout-btn">Logout</button>
      <a href="/dashboard">
        <div class="dash" id="dash">
          <img src="../images/user.png" alt="Profile" />
        </div>
      </a>
    </div>
  `;

  // Add logout handler
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("accessToken");

    await fetch("http://localhost:4000/user/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    localStorage.removeItem("username");
    localStorage.removeItem("accessToken");
    updateNavbar(); // refresh
  });
}
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <img src="../images/check.png" class="toast-icon" alt="Success" />
    <span class="toast-message">${message}</span>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3500);
}

export { updateNavbar };
