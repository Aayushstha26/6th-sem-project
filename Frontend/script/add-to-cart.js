document.addEventListener("DOMContentLoaded", async () => {

  const addToCartBtn = document.querySelectorAll(".cart-btn");

  addToCartBtn.forEach((btn)=>{
    btn.addEventListener("click", async (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("Please login to add items to your cart.");
      return;
    }
    try {
      const res = await fetch("http://localhost:4000/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
        if (!res.ok) throw new Error("Network response was not ok");    
        const data = await res.json();
        console.log(data);
        alert("Item added to cart successfully!");
    } catch (err) {
      console.error("Failed to add item to cart", err);
      alert("Failed to add item to cart. Please try again.");
    }

  });

  })
});
