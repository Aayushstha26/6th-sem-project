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

          html = ''
          if (result.payments && result.payments.length > 0) {
            html += `
              <div class="payment-history">
                <h2>Payment History</h2>
                <div class="payment-timeline">
            `;
            
            result.payments.forEach((payment) => {
              const statusClass = payment.status ? payment.status.toLowerCase() : 'pending';
              const date = new Date(payment.paidAt || payment.createdAt).toLocaleDateString("en-US", {
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
                    ${payment.status === 'Success' ? '<button class="receipt-btn">Download Receipt</button>' : ''}
                  </div>
                </div>
              `;
            });
            
            html += `
                </div>
              </div>
            `;
          } else {
            html = '<div class="payment-history"><p class="no-payments">No payment history found.</p></div>';
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
