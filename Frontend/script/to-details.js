document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    console.error("❌ Product ID not found in URL");
    document.querySelector(".details-container").innerHTML = "<p>Product not found.</p>";
    return;
  }

  try {
    const res = await fetch(`http://localhost:4000/product/${productId}`);

    if (!res.ok) throw new Error("Network response was not ok");

    const data = await res.json();
    const product = data.product;
    console.log(product);

    if (!product) {
      document.querySelector(".details-container").innerHTML = "<p>Product not found in database.</p>";
      return;
    }

    // ✅ Set product details safely
document.querySelector(".product-image img").src = product.productImg || "../images/default.jpg";
document.querySelector(".product-title").textContent = product.product_name;
document.querySelector(".category").textContent = product.category?.name || "Uncategorized";
document.querySelector(".product-price").textContent = `RS. ${product.price}`;
document.querySelector(".product-description").textContent = product.description;

  } catch (err) {
    console.error("❌ Error loading product details:", err);
    document.querySelector(".details-container").innerHTML = "<p>Failed to load product details.</p>";
  }
});
