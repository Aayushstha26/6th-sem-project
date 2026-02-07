// dashboard.js

document.addEventListener("DOMContentLoaded", () => {
  let token = localStorage.getItem("accessToken");
  let username = localStorage.getItem("username");
  console.log("Username from storage:", username);
  if (!token) {
    showToast("Please login to access your dashboard.");
    window.location.href = "/#loginContent";
    return;
  }
  let user = document.getElementById("username");
  user.textContent = username || "User";
  const menuItems = document.querySelectorAll(".menu li");
  const contentArea = document.getElementById("content-area");

  // Default section
  loadSection("dashboard");

  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Remove active class
      menuItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");

      const sectionName = item.textContent.trim().toLowerCase();
      loadSection(sectionName);
    });
  });

  async function loadSection(name) {
    let html = "";

    switch (name) {
      case "🏠 dashboard":
        // Initialize variables before try block
        let totalOrders = 0;
        let deliveredOrders = 0;
        let pendingOrders = 0;
        let ordersHTML = "";

        try {
          const res = await fetch("/order/orders", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await res.json();
          console.log("API Response:", data);

          if (!res.ok) {
            throw new Error(data.message || "Failed to fetch orders");
          }

          const orders = data.data || [];
          console.log("Orders array:", orders);

          totalOrders = orders.length;

          // Calculate delivered and pending orders
          deliveredOrders = orders.filter(
            (order) => order.orderStatus === "Delivered",
          ).length;
          pendingOrders = orders.filter(
            (order) => order.orderStatus === "Pending",
          ).length;

          console.log("Total Orders:", totalOrders);
          console.log("Delivered:", deliveredOrders);
          console.log("Pending:", pendingOrders);

          // Generate orders HTML dynamically
          if (orders.length > 0) {
            ordersHTML = orders
              .map(
                (order) => `
        <div class="order-card">
          <div class="order-header">
            <h3>Order #${order._id.slice(-6)}</h3>
            <span class="order-date">${new Date(
              order.createdAt,
            ).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}</span>
          </div>
          
          <div class="order-details">
            <p><strong>Items:</strong> ${order.items
              .map((item) => item.product.product_name)
              .join(", ")}</p>
            <p><strong>Total:</strong> Rs${order.amount}</p>
            <p><strong>Payment:</strong> ${order.paymentStatus}</p>
            <p><strong>Status:</strong> <span class="status ${
              order.orderStatus
            }">${order.orderStatus}</span></p>
          </div>
          
          <button class="view-btn" onclick="viewOrderDetails('${
            order._id
          }')">View Details</button>
        </div>
      `,
              )
              .join("");
          } else {
            ordersHTML =
              '<p class="no-orders">No orders found. Start shopping now!</p>';
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
          showToast("Failed to load orders. Please try again.");
          ordersHTML =
            '<p class="error-message">Unable to load orders. Please refresh the page.</p>';
        }

        // Set HTML after try-catch so it always renders
        html = `
    <section class="overview">
      <div class="card"><h3>Total Orders</h3><p>${totalOrders}</p></div>
      <div class="card"><h3>Delivered</h3><p>${deliveredOrders}</p></div>
      <div class="card"><h3>Pending</h3><p>${pendingOrders}</p></div>
    </section>
    <div class="orders-container">
      ${ordersHTML}
    </div>
  `;
        break;
      case "🛍️ my orders":
        let myOrdersHTML = "";

        try {
          const res = await fetch("/order/orders", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Failed to fetch orders");
          }

          const orders = data.data || [];

          if (orders.length > 0) {
            myOrdersHTML = orders
              .map(
                (order) => `
        <div class="order-card">
          <div class="order-header">
            <h3>Order #${order._id.slice(-6)}</h3>
            <span class="order-date">${new Date(
              order.createdAt,
            ).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}</span>
          </div>
          
          <div class="order-details">
            <p><strong>Items:</strong> ${order.items
              .map((item) => item.product.product_name)
              .join(", ")}</p>
            <p><strong>Total:</strong> Rs${order.amount}</p>
            <p><strong>Payment:</strong> ${order.paymentStatus}</p>
            <p><strong>Status:</strong> <span class="status ${
              order.orderStatus
            }">${order.orderStatus}</span></p>
          </div>
          
          <button class="view-btn" onclick="viewOrderDetails('${
            order._id
          }')">View Details</button>
        </div>
      `,
              )
              .join("");
          } else {
            ordersHTML =
              '<p class="no-orders">No orders found. Start shopping now!</p>';
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
          showToast("Failed to load orders. Please try again.");
          myOrdersHTML =
            '<p class="error-message">Unable to load orders. Please refresh the page.</p>';
        }

        html = `<div class="orders-container">${myOrdersHTML}</div>`;
        break;
      case "⚙️ profile settings":
        // Fetch current user profile data
        let profileData = {};

        try {
          const res = await fetch("/user/get", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await res.json();

          if (res.ok) {
            profileData = data.data || {};
            console.log("Profile data:", profileData);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          showToast("Failed to load profile data");
        }

        html = `
    <section class="profile-settings">
      <form class="profile-form" id="profileForm">
        <h2>Profile Settings</h2>

        <label>First Name</label>
        <input type="text" id="fullName" name="fullName" placeholder="" value="${profileData.Firstname || ""}" required />

        <label>Last Name</label>
        <input type="text" id="fullName" name="fullName" placeholder="" value="${profileData.Lastname || ""}" required />

        <label>Email</label>
        <input type="email" id="email" name="email" placeholder="rohan@example.com" value="${profileData.Email || ""}" required />

        <label>Phone</label>
        <input type="text" id="phone" name="phone" placeholder="+977-98XXXXXXX" value="${profileData.Phone || ""}" />

      

        <a href="/reset-password" class="change-password-link" onclick="loadChangePassword(event)">Change Password</a>

        <div class="btn">
          <button id="submit-btn" type="submit">Save Changes</button>
        </div>
      </form>
    </section>
  `;

        // Add event listener after HTML is rendered
        setTimeout(() => {
          const profileForm = document.getElementById("profileForm");
          if (profileForm) {
            profileForm.addEventListener("submit", handleProfileUpdate);
          }
        }, 100);

        break;

      case "💳 payment history":
        html = "";
        try {
          const result = await PaymentHistory();

          html = "";
          if (result.payments && result.payments.length > 0) {
            html += `
              <div class="payment-history">
                <h2>Payment History</h2>
                <div class="payment-timeline">
            `;

            result.payments.forEach((payment) => {
              const statusClass = payment.status
                ? payment.status.toLowerCase()
                : "pending";
              const date = new Date(
                payment.paidAt || payment.createdAt,
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              html += `
                <div class="timeline-item ${statusClass}">
                  <div class="timeline-content">
                    <div class="timeline-date">${date}</div>
                    <h4>Payment #${payment.transaction_uuid || payment._id.slice(-6)}</h4>
                    <p><strong>Amount:</strong> Rs. ${payment.amount}</p>
                    <p><strong>Method:</strong> ${payment.paymentMethod}</p>
                    <p><strong>Status:</strong> <span class="status ${payment.status}">${payment.status}</span></p>
                    ${payment.status === "Success" ? '<button class="receipt-btn">Download Receipt</button>' : ""}
                  </div>
                </div>
              `;
            });

            html += `
                </div>
              </div>
            `;
          } else {
            html =
              '<div class="payment-history"><p class="no-payments">No payment history found.</p></div>';
          }
        } catch (err) {
          console.error("Error loading payment history:", err);
          html = "<p style='color:red;'>⚠️ Failed to load payment history.</p>";
        }

        break;

      default:
        html = `<p>Section not found.</p>`;
    }

    contentArea.classList.remove("fade");
    contentArea.innerHTML = html;
    setTimeout(() => contentArea.classList.add("fade"), 50);
  }

  const submit_btn = document.getElementById("submit-btn");
  if (submit_btn) {
    submit_btn.addEventListener("click", handleProfileUpdate);
  }
  let logoutBtn = document.querySelector(".logout-btn");
  logoutBtn.addEventListener("click", async () => {
    try {
      fetch("/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      window.location.href = "/";
    } catch (err) {
      console.error("Logout failed:", err);
      showToast("Logout failed. Please try again.");
    }
  });
});

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <img src="../images/check.png" class="toast-icon" alt="Success" />
    <span class="toast-message">${message}</span>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3500);
}
async function handleProfileUpdate(e) {
  e.preventDefault();

  const token = localStorage.getItem("accessToken");

  const formData = {
    Firstname: document.getElementById("fullName").value,
    Lastname: document.getElementById("fullName").value,
    Email: document.getElementById("email").value,
    Phone: document.getElementById("phone").value,
  };

  console.log("Updating profile with:", formData);

  try {
    const res = await fetch("/user/update-user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log("Update response:", data);

    if (!res.ok) {
      throw new Error(data.message || "Failed to update profile");
    }

    // Update username in localStorage if it changed
    if (formData.fullName) {
      localStorage.setItem("username", formData.fullName);
      document.getElementById("username").textContent = formData.fullName;
    }

    showToast("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error);
    showToast(error.message || "Failed to update profile");
  }
}

// ... existing code ...

async function PaymentHistory() {
  const token = localStorage.getItem("accessToken");
  const res = await fetch("/payment/history", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  console.log("Payment history data:", data);
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch payment history");
  }
  return data;
}

// ... existing code ...

// Global scope to be accessible from HTML onclick
window.viewOrderDetails = async function (orderId) {
  console.log("View details for order:", orderId);
  const modal = document.getElementById("order-details-modal");
  const modalBody = document.getElementById("modal-body");
  const closeBtn = document.querySelector(".close-modal");
  const token = localStorage.getItem("accessToken");

  if (!modal || !modalBody) {
    console.error("Modal elements not found");
    return;
  }

  // Show loading state
  modal.style.display = "flex";
  modalBody.innerHTML =
    '<p style="text-align:center;">Loading order details...</p>';

  try {
    // Fetch all orders to find the specific one (or use specific endpoint if available)
    // Since we are already on the dashboard, we might have the orders in memory, but fetching ensures fresh data
    // Optimization: If a get-single-order endpoint exists, use it. Otherwise, filter from list.
    // Assuming /order/orders returns the list.
    const res = await fetch("/order/orders", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch order details");
    }

    const orders = data.data || [];
    const order = orders.find((o) => o._id === orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    // Calculate totals
    const subtotal = order.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    // Assuming shipping is 0 or part of total. If total > subtotal, diff is shipping.
    // But the order object has 'amount' which is total.

    const date = new Date(order.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    let itemsHtml = order.items
      .map(
        (item) => `
            <li class="modal-item">
                <div class="modal-item-info">
                   <img src="${item.product.product_image}" alt="${item.product.product_name}" class="modal-item-image" onerror="this.src='../images/logo.png'">
                    <div>
                        <p><strong>${item.product.product_name}</strong></p>
                        <p style="font-size: 0.9em; color: #666;">Qty: ${item.quantity}</p>
                    </div>
                </div>
                <div>
                   Rs. ${item.price * item.quantity}
                </div>
            </li>
        `,
      )
      .join("");

    // Cancel Button Logic
    let cancelBtnHtml = "";
    if (order.orderStatus === "Pending") {
      cancelBtnHtml = `
                <div class="modal-actions" style="margin-top: 20px; text-align: right;">
                    <button class="cancel-order-btn" onclick="cancelOrder('${order._id}')">Cancel Order</button>
                </div>
            `;
    }

    const html = `
            <div class="modal-order-header">
                <h3>Order Details</h3>
                <p>Order ID: #${order._id.slice(-6)}</p>
                <p>Placed on: ${date}</p>
                 <p>Status: <span class="status ${order.orderStatus}">${order.orderStatus}</span></p>
            </div>

            <div class="modal-section">
                <h4>Items</h4>
                <ul class="modal-item-list">
                    ${itemsHtml}
                </ul>
            </div>

            <div class="modal-section">
                <h4>Payment Info</h4>
                 <p>Method: ${order.paymentMethod}</p>
                 <p>Status: <span class="status ${order.paymentStatus}">${order.paymentStatus}</span></p>
            </div>
            
             <div class="modal-section">
                <h4>Shipping Address</h4>
                 <p>${order.shippingAddress || "Address not available"}</p>
            </div>

            <div class="modal-summary">
                 <p><span>Subtotal</span> <span>Rs. ${subtotal}</span></p>
                 <p><span>Shipping</span> <span>Rs. ${order.amount - subtotal > 0 ? order.amount - subtotal : 0}</span></p>
                 <p style="border-top: 1px solid #ccc; padding-top: 5px; margin-top: 5px;"><strong>Total</strong> <strong>Rs. ${order.amount}</strong></p>
            </div>
            
            ${cancelBtnHtml}
        `;

    modalBody.innerHTML = html;
  } catch (error) {
    console.error("Error loading order details:", error);
    modalBody.innerHTML =
      '<p style="color:red; text-align:center;">Failed to load order details.</p>';
  }

  // Close logic
  closeBtn.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
};

// Cancel Order Function
window.cancelOrder = async function (orderId) {
  const isConfirmed = await showConfirm(
    "Cancel Order",
    "Are you sure you want to cancel this order? This action cannot be undone.",
    { isDanger: true, confirmText: "Yes, Cancel" },
  );

  if (!isConfirmed) return;

  const token = localStorage.getItem("accessToken");
  try {
    const res = await fetch(`/order/update-status/${orderId}`, {
      // Assuming this endpoint exists based on convention
      method: "PUT", // or POST/PATCH depending on backend
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "Cancelled" }), // Assuming backend expects status in body
    });

    const data = await res.json();

    if (res.ok) {
      showToast("Order cancelled successfully!", "success");
      // Refresh modal to show updated status or close it
      // For now, reload the page to refresh headers/status everywhere
      setTimeout(() => {
        location.reload();
      }, 1000);
    } else {
      throw new Error(data.message || "Failed to cancel order");
    }
  } catch (error) {
    console.error("Error cancelling order:", error);
    showToast(
      error.message || "Failed to cancel order. Please try again.",
      "error",
    );
  }
};
