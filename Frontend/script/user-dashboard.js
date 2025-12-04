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

  function loadSection(name) {
    let html = "";

    switch (name) {
      case "🏠 dashboard":
        html = `
          <section class="overview">
            <div class="card"><h3>Total Orders</h3><p>12</p></div>
            <div class="card"><h3>Delivered</h3><p>9</p></div>
            <div class="card"><h3>Pending</h3><p>3</p></div>
          </section>
          <div class="orders-container">
  <div class="order-card">
    <div class="order-header">
      <h3>Order #1023</h3>
      <span class="order-date">Oct 12, 2025</span>
    </div>

    <div class="order-details">
      <p><strong>Items:</strong> Gold Necklace, Diamond Ring</p>
      <p><strong>Total:</strong> $320</p>
      <p><strong>Payment:</strong> eSewa</p>
      <p><strong>Status:</strong> <span class="status delivered">Delivered</span></p>
    </div>

    <button class="view-btn">View Details</button>
  </div>

  <!-- another order -->
  <div class="order-card">
    <div class="order-header">
      <h3>Order #1022</h3>
      <span class="order-date">Sep 30, 2025</span>
    </div>

    <div class="order-details">
      <p><strong>Items:</strong> Silver Bracelet</p>
      <p><strong>Total:</strong> $70</p>
      <p><strong>Payment:</strong> Cash on Delivery</p>
      <p><strong>Status:</strong> <span class="status pending">Pending</span></p>
    </div>

    <button class="view-btn">View Details</button>
  </div>
</div>`;
        break;

      case "🛍️ my orders":
        html = `
          <div class="orders-container">
  <div class="order-card">
    <div class="order-header">
      <h3>Order #1023</h3>
      <span class="order-date">Oct 12, 2025</span>
    </div>

    <div class="order-details">
      <p><strong>Items:</strong> Gold Necklace, Diamond Ring</p>
      <p><strong>Total:</strong> $320</p>
      <p><strong>Payment:</strong> eSewa</p>
      <p><strong>Status:</strong> <span class="status delivered">Delivered</span></p>
    </div>

    <button class="view-btn">View Details</button>
  </div>

  <!-- another order -->
  <div class="order-card">
    <div class="order-header">
      <h3>Order #1022</h3>
      <span class="order-date">Sep 30, 2025</span>
    </div>

    <div class="order-details">
      <p><strong>Items:</strong> Silver Bracelet</p>
      <p><strong>Total:</strong> $70</p>
      <p><strong>Payment:</strong> Cash on Delivery</p>
      <p><strong>Status:</strong> <span class="status pending">Pending</span></p>
    </div>

    <button class="view-btn">View Details</button>
  </div>
</div>
`;
        break;

      case "⚙️ profile settings":
        html = `
          <section class="profile-settings">
  <form class="profile-form">
    <h2>Profile Settings</h2>

    <label>Full Name</label>
    <input type="text" placeholder="Rohan Shrestha" />

    <label>Email</label>
    <input type="email" placeholder="rohan@example.com" />

    <label>Phone</label>
    <input type="text" placeholder="+977-98XXXXXXX" />

    <a href="/change-password" class="change-password-link">Change Password</a>

        <div class = "btn">
        <button type="submit">Save Changes</button>
        </div>
  </form>
</section>
`;
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