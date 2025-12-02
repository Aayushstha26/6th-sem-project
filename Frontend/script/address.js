import { updateNavbar } from "./slider.js";

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 4000);
}

window.addEventListener("DOMContentLoaded", async () => {
  let form = document.getElementById("address-form");
  let fullName = document.getElementById("fullname");
  let phoneNumber = document.getElementById("phone");
  let postalCode = document.getElementById("zipcode");
  let address = document.getElementById("address");
  let email = document.getElementById("email");
  let city = document.getElementById("city");

  const token = localStorage.getItem("accessToken");
  if (!token) {
    showToast("Please login to add your address.");
    return;
  }

  updateNavbar(false);

  // ✅ FIXED: Event listeners OUTSIDE submit handler
  fullName.addEventListener("input", () => {
    checkvalid(
      fullName,
      fullName.value.trim() !== "" && isName(fullName.value.trim()),
      "Full name must be at least 3 characters"
    );
  });

  phoneNumber.addEventListener("input", () => {
    checkvalid(
      phoneNumber,
      phoneNumber.value.trim() !== "" && isPhone(phoneNumber.value.trim()),
      "Phone must be 10 digits"
    );
  });

  postalCode.addEventListener("input", () => {
    checkvalid(
      postalCode,
      postalCode.value.trim() !== "" && isPostalCode(postalCode.value.trim()),
      "Postal code must be 5 digits"
    );
  });

  address.addEventListener("input", () => {
    checkvalid(
      address,
      address.value.trim().length >= 5,
      "Address must be at least 5 characters"
    );
  });

  email.addEventListener("input", () => {
    checkvalid(
      email,
      email.value.trim() !== "" && isEmail(email.value.trim()),
      "Not a valid email"
    );
  });

  city.addEventListener("input", () => {
    checkvalid(
      city,
      city.value.trim() !== "" && isName(city.value.trim()),
      "City must be at least 3 characters"
    );
  });

  // Validation functions
  function isEmail(email) {
    return /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z]+\.[a-zA-Z]{2,}$/.test(email);
  }

  function isName(name) {
    return /^[a-zA-Z\s]{3,}$/.test(name);
  }

  function isPhone(phone) {
    return /^\d{10}$/.test(phone);
  }

  function isPostalCode(code) {
    return /^\d{5}$/.test(code);
  }

  function checkAddressform() {
    let isValid = true;

    checkvalid(
      fullName,
      fullName.value.trim() !== "" && isName(fullName.value.trim()),
      "Full name can't be blank"
    );
    checkvalid(
      phoneNumber,
      phoneNumber.value.trim() !== "" && isPhone(phoneNumber.value.trim()),
      "Phone must be 10 digits"
    );
    checkvalid(
      postalCode,
      postalCode.value.trim() !== "" && isPostalCode(postalCode.value.trim()),
      "Postal code must be 5 digits"
    );
    checkvalid(
      address,
      address.value.trim().length >= 5,
      "Address must be at least 5 characters"
    );
    checkvalid(
      email,
      email.value.trim() !== "" && isEmail(email.value.trim()),
      "Not a valid email"
    );
    checkvalid(
      city,
      city.value.trim() !== "" && isName(city.value.trim()),
      "City can't be blank"
    );

    document
      .querySelectorAll("#address-form .input-group")
      .forEach((control) => {
        if (control.classList.contains("error")) {
          isValid = false;
        }
      });

    // ✅ FIXED: Return statement outside forEach
    return isValid;
  }

  function checkvalid(input, condition, errormsg) {
    if (condition) {
      setSuccess(input);
    } else {
      setError(input, errormsg);
    }
  }

  function setSuccess(input) {
    let input_group = input.parentElement;
    let icon = input_group.querySelector(".icon");
    let errorMessage = input_group.querySelector(".errorMsg");
    errorMessage.innerHTML = "";
    input_group.className = "input-group success";
    icon.className = "icon fas fa-check-circle";
  }

  function setError(input, errormsg) {
    let input_group = input.parentElement;
    let icon = input_group.querySelector(".icon");
    let errorMessage = input_group.querySelector(".errorMsg");
    errorMessage.innerHTML = errormsg;
    input_group.className = "input-group error";
    icon.className = "icon fas fa-times-circle";
  }

  
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Check if form is valid
    if (!checkAddressform()) {
      return; // Stop if validation fails
    }

    // Collect form data
    const formData = {
      fullName: fullName.value,
      phoneNumber: phoneNumber.value,
      postalCode: postalCode.value,
      address: address.value,
      email: email.value,
      city: city.value,
    };

    try {
      // Send address to server
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

        // Prepare payment
        let product_code = "EPAYTEST";
        let total_amount = document
          .getElementById("total")
          .innerText.replace("Rs. ", "")
          .trim();
        let transaction_uuid = "TXN" + Date.now().toString();

        // Get payment signature
        const response = await fetch(
          "http://localhost:4000/payment/generate-signature",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              total_amount: total_amount,
              transaction_uuid: transaction_uuid,
              product_code: product_code,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          handlePaymentRedirect(
            total_amount,
            transaction_uuid,
            product_code,
            data.signature
          );
        }

        form.reset();
      } else {
        alert(result.message || "Failed to save address");
      }
    } catch (err) {
      console.error("Failed to save address", err);
      alert("Error saving address. Please try again.");
    }
  });

  // Load cart items
  let orderItemsDiv = document.getElementById("order-summary");

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

  items.forEach((item) => {
    const product = item.productId;
    let image = product.productImg || "../images/default.jpg";
    let name = product.product_name;
    let qty = item.quantity;
    let price = product.price;

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
         </div>`;
});

const handlePaymentRedirect = (
  total_amount,
  transaction_uuid,
  product_code,
  signature
) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
  form.style.display = "none";

  const params = {
    amount: total_amount,
    tax_amount: "0",
    product_service_charge: "0",
    product_delivery_charge: "0",
    total_amount: total_amount,
    transaction_uuid: transaction_uuid,
    product_code: product_code,
    signature: signature,
    success_url: "http://localhost:4000/payment-success",
    failure_url: "http://localhost:4000/payment-failure",
    signed_field_names: "total_amount,transaction_uuid,product_code",
  };

  console.log(params);
  for (const key in params) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = params[key];
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
};
