import { updateNavbar } from "./slider.js";

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".product-slots");
  const cTitle = document.querySelector("#product-title");

  const token = localStorage.getItem("accessToken");
  console.log(token);
  if (token) {
    updateNavbar();
  }

  container.innerHTML = `<p>Loading products...</p>`; // temporary message

  // Handle category filtering
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category") || "All";

  cTitle.textContent = category;

  try {
    const res = await fetch("http://localhost:4000/product/products");
    if (!res.ok) throw new Error("Network response was not ok");

    const data = await res.json();

    // Filter products by category if not "All"
    const products =
      category === "All"
        ? data.products
        : data.products.filter((p) => p.category?.name === category);
    console.log(products);

    if (!products || products.length === 0) {
      container.innerHTML = `<p>No products found for "${category}"</p>`;
      return;
    }

    // Build HTML string with enhanced card design
    let html = "";
    products.forEach((p) => {
      // Determine stock status
      const stock = p.stock || 0;
      let stockClass = "out-of-stock";
      let stockText = "Out of Stock";

      if (stock > 10) {
        stockClass = "in-stock";
        stockText = `In Stock (${stock} units)`;
      } else if (stock > 0) {
        stockClass = "low-stock";
        stockText = `Low Stock (${stock} units)`;
      }

      html += `
        <div class="product-card">
  <div class="product-image-wrapper">
    <img src="${p.productImg || "../images/default.jpg"}" alt="${
        p.product_name
      }" />
  </div>
  <div class="product-info" data-product-id="${p._id}">
    <span class="product-name">${p.product_name}</span>
    <span class="product-category">${p.category?.name || "Uncategorized"}</span>
    <p class="product-description">${
      p.description || "High-quality product with excellent features."
    }</p>
    <div class="product-stock ${stockClass}">
      <span class="stock-indicator"></span>
      <span>${stockText}</span>
    </div>
    <div class="product-price-tag">
      <svg class="price-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
    <path d="M458.67 149.33L362.67 53.33C356.44 47.11 348.44 42.67 339.56 42.67H106.67C83.56 42.67 64 62.22 64 85.33V426.67C64 449.78 83.56 469.33 106.67 469.33H405.33C428.44 469.33 448 449.78 448 426.67V172.44C448 163.56 443.56 155.56 437.33 149.33H458.67Z" fill="#70C6A5"/>
    <path d="M448 426.67V172.44C448 163.56 443.56 155.56 437.33 149.33L362.67 53.33C356.44 47.11 348.44 42.67 339.56 42.67H298.67V469.33H405.33C428.44 469.33 448 449.78 448 426.67Z" fill="#5FB89A"/>
    <circle cx="384" cy="128" r="32" fill="white"/>
    <path d="M480 32L384 128L416 160L512 64L480 32Z" fill="#F4D190"/>
    <path d="M512 64L480 32L448 64V96L480 128L512 96V64Z" fill="#E6C077"/>
  </svg>
      <span class="product-price">RS. ${p.price}</span>
    </div>
  </div>
  </div>
      `;
    });

    container.innerHTML = html;

    // Add click event listeners after cards are rendered
    const cards = document.querySelectorAll(".product-card");
    console.log(cards);
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        const productId = card
          .querySelector(".product-info")
          .getAttribute("data-product-id");
        window.location.href = `product-details?id=${productId}`;
        console.log(productId);
      });
    });
  } catch (err) {
    console.error("Error loading products:", err);
    container.innerHTML =
      "<p style='color:red;'>⚠️ Failed to load products.</p>";
  }




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
      resultItem.addEventListener("click", () => {
        window.location.href = `/product-details/${item.id || item._id}`;
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

});
