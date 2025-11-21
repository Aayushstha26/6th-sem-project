window.addEventListener("DOMContentLoaded", async () => {
  let form = document.getElementById("address-form");
  let fullName = document.getElementById("fullname");
  let phoneNumber = document.getElementById("phone");
  let postalCode = document.getElementById("zipcode");
  let address = document.getElementById("address");
    let email = document.getElementById("email");
  let city = document.getElementById("city");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      fullName: fullName.value,
      phoneNumber: phoneNumber.value,
      postalCode: postalCode.value,
      address: address.value,
      email: email.value,
      city: city.value,
    };
    console.log(formData);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Please login to add your address.");
        return;
      }

      const res = await fetch("http://localhost:4000/address/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        alert(result.message);
        form.reset();
      } else {
        alert(result.message || "Failed to save address");
      }
    } catch (err) {
      console.error("Failed to save address", err);
    }
  });

  
  let orderItemsDiv = document.getElementById("order-summary");

  const token = localStorage.getItem("accessToken");
  if (!token) {
    alert("Please login to view your cart.");
    return;
  }

  const cartItems = await fetch("http://localhost:4000/cart/getCart", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!cartItems.ok) {
    alert("Failed to fetch cart items.");
    return;
  }
  const data = await cartItems.json();
  console.log(data);
  let items = data.cart.products;

  // Assuming there are at least two items in the cart
  items.forEach((item) => {
    const product = item.productId;
    let image = product.productImg || "../images/default.jpg";
    let name = product.product_name;
    let qty = item.quantity;
    let price = product.price;

 

 
    //   subtotalValue += price * qty;

    orderItemsDiv.innerHTML += `
    <div class="item">
      <img class="item-pic" src="${image}" />
      <div>
        <p class="item-name">${name}</p>
        <p class="item-qty">Qty: ${qty}</p>
      </div>
      <p class="item-price">Rs. ${price}</p>
    </div>

    
  `;
  });
   let shippingValue = 100;
  orderItemsDiv.innerHTML += `
  <div class="order-totals"> 
    <div class="line"> 
    <span>Subtotal</span> 
    <span id="sub-total">Rs. ${data.cart.totalAmount}</span> 
    </div>
     <div class="line">
      <span>Shipping Fee</span>
       <span id="Shipping-fee">Rs. ${shippingValue}</span> 
       </div> <div class="line total">
        <span>Total
       </span>
        <span id="total">Rs. ${data.cart.totalAmount + shippingValue}
        </span> 
        </div>
         </div>`

  // UPDATE TOTALS

});
