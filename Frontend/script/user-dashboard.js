// dashboard.js

document.addEventListener("DOMContentLoaded", () => {
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
            <div class="card"><h3>Wishlist Items</h3><p>5</p></div>
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

      case "💖 wishlist":
        html = `
          <section class="wishlist">
            <h2>My Wishlist</h2>
            <div class="wishlist-grid">
              <div class="wishlist-item">
                <img src="../images/earring.jpg" alt="Earring" />
                <p>Golden Earring</p>
                <button class="view-btn">View</button>
              </div>
              <div class="wishlist-item">
                <img src="../images/bracelet.jpg" alt="Bracelet" />
                <p>Diamond Bracelet</p>
                <button class="view-btn">View</button>
              </div>
            </div>
          </section>`;
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

    <label>Password</label>
    <input type="password" placeholder="********" />

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
            <table>
              <thead>
                <tr><th>Date</th><th>Transaction ID</th><th>Amount</th><th>Method</th></tr>
              </thead>
              <tbody>
                <tr><td>Oct 8, 2025</td><td>TXN1025</td><td>Rs. 2,500</td><td>eSewa</td></tr>
                <tr><td>Oct 10, 2025</td><td>TXN1028</td><td>Rs. 1,200</td><td>Khalti</td></tr>
              </tbody>
            </table>
          </section>`;
        break;

      default:
        html = `<p>Section not found.</p>`;
    }

    contentArea.classList.remove("fade");
    contentArea.innerHTML = html;
    setTimeout(() => contentArea.classList.add("fade"), 50);
  }
});
