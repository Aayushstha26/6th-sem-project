document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector(".new-arrivals-slots");

  try {
    const res = await fetch("http://localhost:4000/product/new-arrivals");
    if (!res.ok) throw new Error("Network response was not ok");

    const data = await res.json();

    // Build HTML with forEach
    let html = "";
    data.products.forEach(p => {
      html += `
         <div class="new-arrivals">
         <div class="product-info" data-product-id="${p._id}">
          <img src="${p.productImg}" alt="${p.product_name}" />
          <div class="text">
            <span class="name">${p.product_name}</span>
            <span class="c-s">${p.category?.name || "Uncategorized"}</span>
            <div class="price-tag">
              <img class="tag" src="../images/price-tag.png" alt="Price Tag"/>
              <span class="price">RS.${p.price}</span>
            </div>
          </div>
        </div>
        </div>
      `;
    });

    container.innerHTML = html;
  } catch (err) {
    console.error("Error loading new arrivals:", err);
    container.innerHTML = "<p>⚠️ Failed to load new arrivals.</p>";
  }


  const card = document.querySelectorAll(".new-arrivals");
  console.log(card);
  card.forEach((card) => {
    card.addEventListener("click", () => {
      const productId = card.querySelector(".product-info").getAttribute("data-product-id");
      window.location.href = `product-details?id=${productId}`;
      console.log(productId);
    }); 
  });
});
