import { updateNavbar } from "./slider.js";

  document.addEventListener("DOMContentLoaded",  async() => {

    const token = localStorage.getItem("accessToken");
    if(!token){
      // window.location.href = "/signin";
      alert("Please login to access the cart.");
      return;
    }
    else{
      updateNavbar();
      const cartContainer = document.querySelector(".cart-items");
  const subtotalElem = document.querySelector(".summary-row span:last-child");
  const totalElem = document.querySelector(".summary-total span:last-child");

  const token = localStorage.getItem("accessToken"); // assuming you saved JWT after login

  if (!token) {
    cartContainer.innerHTML = `<p style="text-align:center;">Please login to view your cart.</p>`;
    return;
  }

  try {
    const res = await fetch("http://localhost:4000/cart/getCart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!data.cart || data.cart.products.length === 0) {
      cartContainer.innerHTML = `<p style="text-align:center;">Your cart is empty.</p>`;
      updateSummary(0);
      return;
    }

    renderCart(data.cart.products);
    updateSummary(data.cart.totalAmount);
  } catch (error) {
    console.error("Error loading cart:", error);
    cartContainer.innerHTML = `<p style="text-align:center;color:red;">Failed to load cart.</p>`;
  }

  // --- Functions ---
  function renderCart(items) {
    cartContainer.innerHTML = "";
    
    items.forEach((item) => {
      
      const product = item.productId;
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
        <img src="${product.productImg || "../images/"}" alt="${product.product_name}" />
        <div class="item-info">
          <h2>${product.product_name}</h2>
          <p class="item-price">Rs. ${product.price}</p>
        </div>
        <div class="item-actions">
          <div class="qty-box">
            <button class="decrease">-</button>
            <input type="number" value="${item.quantity}" min="1" />
            <button class="increase">+</button>
          </div>
          <span class="remove-btn">Remove</span>
        </div>
      `;
      cartContainer.appendChild(cartItem);

      // Quantity update handlers
      const qtyInput = cartItem.querySelector("input");
      const decBtn = cartItem.querySelector(".decrease");
      const incBtn = cartItem.querySelector(".increase");
      const removeBtn = cartItem.querySelector(".remove-btn");
console.log(item.productId._id);
      decBtn.addEventListener("click", () => updateQuantity(item.productId._id, qtyInput, -1));
      incBtn.addEventListener("click", () => updateQuantity(item.productId._id, qtyInput, +1));
      qtyInput.addEventListener("change", () => updateQuantity(item.productId._id, qtyInput, 0, true));
      removeBtn.addEventListener("click", () => removeItem(item.productId._id));
    });
  }

  async function updateQuantity(productId, input, change = 0, direct = false) {
    console.log("updateQuantity called", { productId, change, direct });
     let currentQty = parseInt(input.value) || 1;
  let newQty = direct ? currentQty : currentQty + change;

  if (newQty < 1) newQty = 1;

 
  input.value = newQty;
  console.log(newQty);
  
    try {
      await fetch("http://localhost:4000/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: productId, quantity: newQty }),
      });
      location.reload(); // reload to update summary + display
    } catch (err) {
      console.error("Failed to update quantity", err);
    }
  }

  async function removeItem(productId) {
    try {
      await fetch(`http://localhost:4000/cart/remove`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
       },
        body: JSON.stringify({ productId : productId})
      });
      location.reload();
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  }

  function updateSummary(total) {
    subtotalElem.textContent = `Rs. ${total}`;
    totalElem.textContent = `Rs. ${total}`;
  }
      updateNavbar();
    }
  });