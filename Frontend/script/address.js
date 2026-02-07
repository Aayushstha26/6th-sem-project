import { updateNavbar } from "./slider.js";

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
    showToast("Please login to add your address.", "warning");
    return;
  }

  updateNavbar(false);

    const res = await fetch("http://localhost:4000/user/get", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.ok) {
    const data = await res.json();
    console.log("User data response:", data);
    const user = data.data;

    console.log("User data:", user);
    fullName.value = `${user.Firstname} ${user.Lastname}`;
    email.value = user.Email;
    phoneNumber.value = user.Phone || "";
  } else {
    showToast("Failed to fetch user information.", "error");
  }

  // ✅ FIXED: Event listeners OUTSIDE submit handler
  fullName.addEventListener("input", () => {
    checkvalid(
      fullName,
      fullName.value.trim() !== "" && isName(fullName.value.trim()),
      "Full name must be at least 3 characters",
    );
  });

  phoneNumber.addEventListener("input", () => {
    checkvalid(
      phoneNumber,
      phoneNumber.value.trim() !== "" && isPhone(phoneNumber.value.trim()),
      "Phone must be 10 digits",
    );
  });

  postalCode.addEventListener("input", () => {
    checkvalid(
      postalCode,
      postalCode.value.trim() !== "" && isPostalCode(postalCode.value.trim()),
      "Postal code must be 5 digits",
    );
  });

  address.addEventListener("input", () => {
    checkvalid(
      address,
      address.value.trim().length >= 5,
      "Address must be at least 5 characters",
    );
  });

  email.addEventListener("input", () => {
    checkvalid(
      email,
      email.value.trim() !== "" && isEmail(email.value.trim()),
      "Not a valid email",
    );
  });

  city.addEventListener("input", () => {
    checkvalid(
      city,
      city.value.trim() !== "" && isName(city.value.trim()),
      "City must be at least 3 characters",
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
      "Full name can't be blank",
    );
    checkvalid(
      phoneNumber,
      phoneNumber.value.trim() !== "" && isPhone(phoneNumber.value.trim()),
      "Phone must be 10 digits",
    );
    checkvalid(
      postalCode,
      postalCode.value.trim() !== "" && isPostalCode(postalCode.value.trim()),
      "Postal code must be 5 digits",
    );
    checkvalid(
      address,
      address.value.trim().length >= 5,
      "Address must be at least 5 characters",
    );
    checkvalid(
      email,
      email.value.trim() !== "" && isEmail(email.value.trim()),
      "Not a valid email",
    );
    checkvalid(
      city,
      city.value.trim() !== "" && isName(city.value.trim()),
      "City can't be blank",
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

    // Get selected payment method
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

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
        showToast(result.message, "success");

        // Route based on payment method
        if (paymentMethod === "cod") {
          // Handle COD Payment
          await handleCODPayment();
        } else {
          // Handle eSewa Payment
          await handleEsewaPayment();
        }

        form.reset();
      } else {
        showToast(result.message || "Failed to save address", "error");
      }
    } catch (err) {
      console.error("Failed to save address", err);
      showToast("Error saving address. Please try again.", "error");
    }
  });

  // COD Payment Handler
  async function handleCODPayment() {
    try {
      const buyNowItemJson = sessionStorage.getItem("buyNowItem");
      const requestBody = {};

      if (buyNowItemJson) {
        // Buy Now flow
        requestBody.isBuyNow = true;
        requestBody.buyNowItem = JSON.parse(buyNowItemJson);
      } else {
        // Cart flow
        requestBody.isBuyNow = false;
      }

      const response = await fetch("http://localhost:4000/payment/cod-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Order placed successfully!", "success");
        // Clear buy now item if exists
        sessionStorage.removeItem("buyNowItem");
        // Redirect to success page
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        showToast(data.message || "Failed to place order", "error");
      }
    } catch (error) {
      console.error("COD payment error:", error);
      showToast("Error processing COD payment. Please try again.", "error");
    }
  }

  // eSewa Payment Handler
  async function handleEsewaPayment() {
    try {
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
        },
      );

      if (response.ok) {
        const data = await response.json();
        handlePaymentRedirect(
          total_amount,
          transaction_uuid,
          product_code,
          data.signature,
        );
      } else {
        showToast("Failed to generate payment signature", "error");
      }
    } catch (error) {
      console.error("eSewa payment error:", error);
      showToast("Error processing eSewa payment. Please try again.", "error");
    }
  }

  // Load cart items OR Buy Now item
  let orderItemsDiv = document.getElementById("order-summary");
  const buyNowItemJson = sessionStorage.getItem("buyNowItem");

  if (buyNowItemJson) {
    // Handle Buy Now flow
    const buyNowItem = JSON.parse(buyNowItemJson);
    try {
      const res = await fetch(
        `http://localhost:4000/product/${buyNowItem.productId}`,
      );
      if (!res.ok) throw new Error("Failed to fetch product details");

      const data = await res.json();
      const product = data.product;
      const totalAmount = product.price * buyNowItem.quantity;

      orderItemsDiv.innerHTML += `
        <div class="item">
          <img class="item-pic" src="${product.productImg || "../images/default.jpg"}" />
          <div>
            <p class="item-name">${product.product_name}</p>
            <p class="item-qty">Qty: ${buyNowItem.quantity}</p>
          </div>
          <p class="item-price">Rs. ${product.price}</p>
        </div>
      `;

      orderItemsDiv.innerHTML += `
        <div class="order-totals"> 
          <div class="line"> 
            <span>Subtotal</span> 
            <span id="sub-total">Rs. ${totalAmount}</span> 
          </div>
          <div class="line total">
            <span>Total</span>
            <span id="total">Rs. ${totalAmount}</span> 
          </div>
        </div>`;
    } catch (err) {
      console.error("Error loading buy now item:", err);
      showToast("Error loading product information.", "error");
    }
  } else {
    // Original Cart flow
    const cartItems = await fetch("http://localhost:4000/cart/getCart", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!cartItems.ok) {
      showToast("Failed to fetch cart items.", "error");
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

    orderItemsDiv.innerHTML += `
      <div class="order-totals"> 
        <div class="line"> 
          <span>Subtotal</span> 
          <span id="sub-total">Rs. ${data.cart.totalAmount}</span> 
        </div>
        <div class="line total">
          <span>Total</span>
          <span id="total">Rs. ${data.cart.totalAmount}</span> 
        </div>
      </div>`;
  }
});

const handlePaymentRedirect = (
  total_amount,
  transaction_uuid,
  product_code,
  signature,
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
