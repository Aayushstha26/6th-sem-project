document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  const quantityInput = document.getElementById("quantity");

  if (!productId) {
    console.error("❌ Product ID not found in URL");
    document.querySelector(".details-container").innerHTML =
      "<p>Product not found.</p>";
    return;
  }

  try {
    const res = await fetch(`http://localhost:4000/product/${productId}`);

    if (!res.ok) throw new Error("Network response was not ok");

    const data = await res.json();
    const product = data.product;
    console.log(product);

    if (!product) {
      document.querySelector(".details-container").innerHTML =
        "<p>Product not found in database.</p>";
      return;
    }

   const addToCartBtn = document.querySelector(".cart-btn");
   const buy = document.querySelector(".buy-btn");
const quantity = Number(quantityInput.value) || 1;
console.log("Requested quantity:", quantity);
quantityInput.addEventListener("change", () => {
  let qty = Number(quantityInput.value) || 1;
  if (qty < 1) qty = 1;
  quantityInput.value = qty;
  // Update button states based on new quantity
  if (qty > product.stock) {
    addToCartBtn.disabled = true;
    buy.disabled = true;
    addToCartBtn.textContent = `Only ${product.stock} item available`;
    buy.textContent = `Only ${product.stock} item available`;
    addToCartBtn.style.cursor = "not-allowed";
    buy.style.cursor = "not-allowed";
    buy.style.fontSize = "14px";
    addToCartBtn.style.fontSize = "14px";
  } else {
    addToCartBtn.disabled = false;
    buy.disabled = false; 
    addToCartBtn.textContent = "Add to Cart";
    buy.textContent = "Buy Now";
    addToCartBtn.style.cursor = "pointer";
    buy.style.cursor = "pointer";
  }
});

// CASE 1: Product completely out of stock
if (product.stock <= 0) {
  addToCartBtn.disabled = true;
  addToCartBtn.textContent = "Out of Stock";
  buy.disabled = true;
  buy.textContent = "Out of Stock";
  buy.style.cursor = "not-allowed";
  addToCartBtn.style.cursor = "not-allowed";
}
// CASE 2: User quantity is more than available stock
else if (quantity > product.stock) {
  addToCartBtn.disabled = true;
   buy.disabled = true;
  addToCartBtn.textContent = `Only ${product.stock} item available`;
  buy.textContent = `Only ${product.stock} item available`;
  addToCartBtn.style.cursor = "not-allowed";
  buy.style.cursor = "not-allowed";
}
// CASE 3: Everything is fine — enable button
else {
  addToCartBtn.disabled = false;
    buy.disabled = false;
  addToCartBtn.textContent = "Add to Cart";
}


    // ✅ Set product details safely
    document.querySelector(".product-image img").src =
      product.productImg || "../images/default.jpg";
    document.querySelector(".product-title").textContent = product.product_name;
    document.querySelector(".category").textContent =
      product.category?.name || "Uncategorized";
    document.querySelector(
      ".product-price"
    ).textContent = `RS. ${product.price}`;
    document.querySelector(".product-description").textContent =
      product.description;
  } catch (err) {
    console.error("❌ Error loading product details:", err);
    document.querySelector(".details-container").innerHTML =
      "<p>Failed to load product details.</p>";
  }

 
});
