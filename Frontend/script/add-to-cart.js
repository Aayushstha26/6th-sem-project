// import { updateCartCountUi, getCartCount} from "./slider.js";
document.addEventListener("DOMContentLoaded", async () => {
  const qty = document.getElementById("quantity");
  const addToCartBtn = document.querySelectorAll(".cart-btn");
const token = localStorage.getItem("accessToken");
if (token) {
  getCartCount();
}
  addToCartBtn.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();

      const urlParams = new URLSearchParams(window.location.search);
      const productId = urlParams.get("id");
      

      if (!token) {
        alert("Please login to add items to your cart.");
        return;
      }

      // Get quantity correctly
      const quantity = qty ? Number(qty.value) || 1 : 1;

      try {
        const res = await fetch("http://localhost:4000/cart/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId, quantity }),
        });

        if (!res.ok) throw new Error("Network response was not ok");

        const data = await res.json();
        console.log(data);
        alert("Item added to cart successfully!");
        addToCart(); // Update cart count in UI
      } catch (err) {
        console.error("Failed to add item to cart", err);
        alert("Failed to add item to cart. Please try again.");
      }
    });
  });
});
function getCartCount() {
  const count = localStorage.getItem('cartCount');
  return count ? parseInt(count) : 0;
}

// Update cart count in localStorage and UI
function updateCartCount(count) {
  // Save to localStorage
  localStorage.setItem('cartCount', count);
 
  
  // Update the badge
  const cartBadge = document.getElementById('cart-count');
  cartBadge.textContent = count;
  
  // Hide badge if count is 0
  if (count === 0) {
    cartBadge.style.display = 'none';
  } else {
    cartBadge.style.display = 'flex';
  }
}

// Add item to cart
function addToCart() {
  let currentCount = getCartCount();
  currentCount++;
  updateCartCount(currentCount);
}

// Remove item from cart
function removeFromCart() {
  let currentCount = getCartCount();
  if (currentCount > 0) {
    currentCount--;
    updateCartCount(currentCount);
  }
}