document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".top-rated-slots");

  container.innerHTML = `<p>Loading top rated products...</p>`; 

  try {
    const res = await fetch("http://localhost:4000/product/top-rated");
    if (!res.ok) throw new Error("Network response was not ok");

    const data = await res.json();

    if (!data.products || data.products.length === 0) {
      container.innerHTML = `<p>No top rated products available</p>`;
      return;
    }

    let html = "";
    data.products.forEach(p => {
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

      // Format rating display
      const rating = p.averageRating || 0;
      const stars = "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));

      html += `
        <div class="product-card">
          <div class="product-image-wrapper">
             <div class="rating-badge">${stars} (${rating.toFixed(1)})</div>
            <img src="${p.productImg || "../images/default.jpg"}" alt="${p.product_name}" />
          </div>
          <div class="product-info" data-product-id="${p._id}">
            <span class="product-name">${p.product_name}</span>
            <span class="product-category">${p.category?.name || "Uncategorized"}</span>
            <p class="product-description">${p.description || "High-quality product with excellent features."}</p>
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

    const cards = document.querySelectorAll(".top-rated-slots .product-card");
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        const productId = card.querySelector(".product-info").getAttribute("data-product-id");
        window.location.href = `product-details?id=${productId}`;
      });
    });

  } catch (err) {
    console.error("Error loading top rated products:", err);
    container.innerHTML = "<p style='color:red;'>⚠️ Failed to load top rated products.</p>";
  }
});
