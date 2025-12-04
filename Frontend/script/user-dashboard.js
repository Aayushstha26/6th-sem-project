// dashboard.js

document.addEventListener("DOMContentLoaded", () => {
  let token = localStorage.getItem("accessToken");
  let username = localStorage.getItem("username");
  console.log("Username from storage:", username);
  if (!token) {
    showToast("Please login to access your dashboard.");
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
            (order) => order.orderStatus === "Delivered"
          ).length;
          pendingOrders = orders.filter(
            (order) => order.orderStatus === "Pending"
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
              order.createdAt
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
            <p><strong>Total:</strong> $${order.amount}</p>
            <p><strong>Payment:</strong> ${order.paymentMethod}</p>
            <p><strong>Payment:</strong> ${order.paymentStatus}</p>
            <p><strong>Status:</strong> <span class="status ${
              order.orderStatus
            }">${order.orderStatus}</span></p>
          </div>
          
          <button class="view-btn" onclick="viewOrderDetails('${
            order._id
          }')">View Details</button>
        </div>
      `
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
              order.createdAt
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
            <p><strong>Total:</strong> $${order.amount}</p>
            <p><strong>Payment:</strong> ${order.paymentMethod}</p>
            <p><strong>Payment:</strong> ${order.paymentStatus}</p>
            <p><strong>Status:</strong> <span class="status ${
              order.orderStatus
            }">${order.orderStatus}</span></p>
          </div>
          
          <button class="view-btn" onclick="viewOrderDetails('${
            order._id
          }')">View Details</button>
        </div>
      `
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

        <label>Full Name</label>
        <input type="text" id="fullName" name="fullName" placeholder="" value="${profileData.Firstname || ''}" required />

        <label>Full Name</label>
        <input type="text" id="fullName" name="fullName" placeholder="" value="${profileData.Lastname || ''}" required />

        <label>Email</label>
        <input type="email" id="email" name="email" placeholder="rohan@example.com" value="${profileData.Email || ''}" required />

        <label>Phone</label>
        <input type="text" id="phone" name="phone" placeholder="+977-98XXXXXXX" value="${profileData.Phone || ''}" />

        <label>Address</label>
        <input type="text" id="address" name="address" placeholder="Enter your address" value="${profileData.address || ''}" />

        <a href="/reset-password" class="change-password-link" onclick="loadChangePassword(event)">Change Password</a>

        <div class="btn">
          <button type="submit">Save Changes</button>
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
        html = `
         <section class="payment-history">
  <h2>Payment History</h2>
  <div class="payment-timeline">

    <div class="timeline-item success">
      <div class="timeline-date">Oct 12, 2025 — 2:45 PM</div>
      <div class="timeline-content">
        <h4>Payment #PAY1023</h4>
        <p><strong>Order ID:</strong> #ORD2023</p>
                <p><strong>Item:</strong> Earring</p>

        <p><strong>Amount:</strong> $320</p>
        <p><strong>Method:</strong> eSewa</p>
        <p><strong>Transaction Ref:</strong> TXN94853212</p>
        <p><strong>Status:</strong> <span class="status success">Successful</span></p>
        <button class="receipt-btn">Download Receipt</button>
      </div>
    </div>

    <div class="timeline-item pending">
      <div class="timeline-date">Oct 03, 2025 — 5:20 PM</div>
      <div class="timeline-content">
        <h4>Payment #PAY1022</h4>
        <p><strong>Order ID:</strong> #ORD2022</p>
                <p><strong>Item:</strong> Earring</p>

        <p><strong>Amount:</strong> $85</p>
        <p><strong>Method:</strong> Cash on Delivery</p>
        <p><strong>Transaction Ref:</strong> TXN93248422</p>
        <p><strong>Status:</strong> <span class="status pending">Pending</span></p>
        <button class="receipt-btn disabled">Receipt Unavailable</button>
      </div>
    </div>

    <div class="timeline-item failed">
      <div class="timeline-date">Sep 28, 2025 — 8:10 PM</div>
      <div class="timeline-content">
        <h4>Payment #PAY1021</h4>
        <p><strong>Order ID:</strong> #ORD2021</p>
        <p><strong>Item:</strong> Earring</p>
        <p><strong>Amount:</strong> $150</p>
        <p><strong>Method:</strong> Khalti</p>
        <p><strong>Transaction Ref:</strong> TXN92484102</p>
        <p><strong>Status:</strong> <span class="status failed">Failed</span></p>
        <button class="receipt-btn disabled">Retry Payment</button>
      </div>
    </div>

  </div>
</section>

`;
        break;

      default:
        html = `<p>Section not found.</p>`;
    }

    contentArea.classList.remove("fade");
    contentArea.innerHTML = html;
    setTimeout(() => contentArea.classList.add("fade"), 50);
  }
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
    fullName: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
  };

  console.log("Updating profile with:", formData);

  try {
    const res = await fetch("/user/update-profile", {
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