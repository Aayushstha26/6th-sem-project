document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".product-slots");
  const cTitle = document.querySelector("#product-title");

  container.innerHTML = `<p>Loading products...</p>`; // temporary message

  try {
    const res = await fetch("http://localhost:4000/product/products"); // your API endpoint

    if (!res.ok) {
      // e.g. 404, 500
      throw new Error(`Server responded with status ${res.status} (${res.statusText})`);
    }

    const data = await res.json();

    if (data.products) {
      container.innerHTML = ""; // clear loading message

      if (data.products.length === 0) {
        container.innerHTML = `<p>No products available</p>`;
      }

      data.products.forEach((product) => {
        const card = document.createElement("div");
        card.classList.add("product-card");
        card.innerHTML = `
          <img src="${product.productImg || "../images/default.jpg"}" alt="${product.product_name}" />
          <div class="product-info">
            <span class="product-name">${product.product_name}</span>
            <span class="product-category">${product.category?.name || "Uncategorized"}</span>
            <div class="product-price-tag">
              <img class="price-icon" src="../images/price-tag.png" alt="Price Tag" />
              <span class="product-price">RS.${product.price}</span>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    } else {
      container.innerHTML = `<p>Unexpected response format: ${JSON.stringify(data)}</p>`;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    container.innerHTML = `<p style="color:red;">Error loading products: ${error.message}</p>`;
  }

  // Handle category filtering

 const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category") || "All";

  cTitle.textContent = category;

  try {
    const res = await fetch("http://localhost:4000/product/products");
    if (!res.ok) throw new Error("Network response was not ok");

    const data = await res.json();

    // Filter products by category if not "All"
    const products = category === "All"
      ? data.products
      : data.products.filter(p => p.category?.name === category);
      console.log(products);

    if (!products || products.length === 0) {
      container.innerHTML = `<p>No products found for "${category}"</p>`;
      return;
    }

    // Build HTML string
    let html = "";
    products.forEach(p => {
      html += `
        <div class="product-card">
          <img src="${p.productImg || '../images/default.jpg'}" alt="${p.product_name}" />
          <div class="product-info">
            <span class="product-name">${p.product_name}</span>
            <span class="product-category">${p.category?.name || "Uncategorized"}</span>
            <div class="product-price-tag">
              <img class="price-icon" src="../images/price-tag.png" alt="Price Tag" />
              <span class="product-price">RS.${p.price}</span>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

  } catch (err) {
    console.error("Error loading products:", err);
    container.innerHTML = "<p style='color:red;'>⚠️ Failed to load products.</p>";
  }
});

