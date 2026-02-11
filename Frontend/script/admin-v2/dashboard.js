/* Dashboard Logic for Admin v2 */

document.addEventListener("DOMContentLoaded", async () => {
  // DOM Elements
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const viewContainer = document.getElementById("viewContainer");
  const pageTitle = document.getElementById("pageTitle");
  const logoutBtn = document.getElementById("logoutBtn");

  // Check Auth
  const token = localStorage.getItem("adminToken");
  if (!token) {
    window.location.href = "./login.html";
    return;
  }

  // Toggle Sidebar
  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("adminToken");
    window.location.href = "./login.html";
  });

  // Navigation Logic (SPA Routing)
  const links = document.querySelectorAll(".nav-link[data-view]");
  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const viewName = link.dataset.view;

      // Update Active State
      links.forEach((l) => l.classList.remove("active"));
      link.classList.add("active");

      // Render View
      renderView(viewName);
    });
  });

  // Initial View Load
  renderView("dashboard");
});

// Mock Data (For Development) - In production, replace with API calls
async function fetchDashboardStats() {
  try {
    // Here we can call the actual API you have
    // Reusing existing endpoint: /admin/monthly-orders for charts maybe
    const [userRes, productRes, orderRes, analysisRes] = await Promise.all([
      apiCall("http://localhost:4000/user/getUser"),
      apiCall("http://localhost:4000/product/products"),
      apiCall("http://localhost:4000/order/All-orders"),
      apiCall("http://localhost:4000/admin/monthly-orders"),
    ]);

    const stockCount = productRes.products
      ? productRes.products.filter((p) => p.stock > 0).length
      : 0;
    const lowStock = productRes.products
      ? productRes.products.filter((p) => p.stock <= 5 && p.stock > 0).length
      : 0;

    return {
      users: userRes.data ? userRes.data.length : 0,
      products: productRes.products ? productRes.products.length : 0,
      orders: orderRes.data ? orderRes.data.length : 0,
      revenue: analysisRes.data.summary.totalRevenue || 0,
      stockCount: stockCount,
      lowStock: lowStock,
      chartData: analysisRes.data, // { labels, orders, revenue }
    };
  } catch (e) {
    console.error("Failed to load stats", e);
    return null;
  }
}

async function apiCall(url) {
  const token = localStorage.getItem("adminToken");
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return res.json();
}

// Templates & Render Logic
async function renderView(viewName) {
  const container = document.getElementById("viewContainer");
  const pageTitle = document.getElementById("pageTitle");

  // Set Loading
  container.innerHTML = `
        <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading ${viewName}...</p>
        </div>
    `;

  // Routing Switch
  switch (viewName) {
    case "dashboard":
      pageTitle.innerText = "Dashboard Overview";
      const stats = await fetchDashboardStats();
      if (stats) {
        container.innerHTML = getDashboardTemplate(stats);
        // Charts removed from overview, now in analytics
      } else {
        container.innerHTML = `<p class="error-message">Failed to load data.</p>`;
      }
      break;

    case "users":
      pageTitle.innerText = "User Management";
      const users = await fetchUsers();
      if (users) {
        container.innerHTML = getUsersTemplate(users);

        setupUserSearch(users);
      } else {
        container.innerHTML = `<p class="error-message">Failed to load users.</p>`;
      }
      break;

    case "products":
      pageTitle.innerText = "Product Inventory";
      const productsData = await fetchProducts();
      if (productsData) {
        container.innerHTML = getProductsTemplate(productsData.products || []);
        setupProductSearch(productsData.products || []);
      } else {
        container.innerHTML = `<p class="error-message">Failed to load products.</p>`;
      }
      break;

    case "categories":
      pageTitle.innerText = "Category Management";
      const categoriesRes = await fetchCategories();
      if (categoriesRes && categoriesRes.data) {
        container.innerHTML = getCategoriesTemplate(categoriesRes.data);
      } else {
        container.innerHTML = `<p class="error-message">Failed to load categories.</p>`;
      }
      break;

    case "orders":
      pageTitle.innerText = "Order Management";
      const ordersRes = await fetchOrders();
      if (ordersRes && ordersRes.data) {
        console.log("ordersRes.data", ordersRes.data);
        container.innerHTML = getOrdersTemplate(ordersRes.data);
      } else {
        container.innerHTML = `<p class="error-message">Failed to load orders.</p>`;
      }
      break;

    case "analytics":
      pageTitle.innerText = "Analytics & Reports";
      const analyticsData = await fetchAnalyticsData();
      if (analyticsData) {
        container.innerHTML = getAnalyticsTemplate(analyticsData);
        initAnalyticsCharts(analyticsData);
      } else {
        container.innerHTML = `<p class="error-message">Failed to load analytics.</p>`;
      }
      break;

    case "settings":
      pageTitle.innerText = "Settings";
      container.innerHTML = `<h3>Settings Module Coming Soon</h3>`;
      break;

    default:
      container.innerHTML = `<p>View not found</p>`;
  }
}

// Templates
function getDashboardTemplate(data) {
  return `
        <div class="page-header" style="margin-bottom: 30px;">
            <h1 style="font-size: 28px; font-weight: 700; color: var(--text-dark); margin-bottom: 5px;">Dashboard Overview</h1>
            <p style="color: var(--text-muted); font-size: 14px;">Welcome back! Here's what's happening with Aava Treasures today.</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #d62976 0%, #fa7e1e 100%);">👥</div>
                </div>
                <div>
                    <div class="stat-label">Total Users</div>
                    <div class="stat-value">${data.users}</div>
                    <div class="stat-change positive">↑ 12% from last month</div>
                </div>
            </div>
            
            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #fa7e1e 0%, #feda75 100%);">�</div>
                </div>
                <div>
                    <div class="stat-label">Total Products</div>
                    <div class="stat-value">${data.products}</div>
                    <div class="stat-change positive">↑ 8% from last month</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #bfa37c 0%, #a87b50 100%);">�</div>
                </div>
                <div>
                    <div class="stat-label">Total Orders</div>
                    <div class="stat-value">${data.orders}</div>
                    <div class="stat-change positive">↑ 15% from last month</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-header">
                    <div class="stat-icon" style="background: linear-gradient(135deg, #10b981 0%, #55efc4 100%);">�</div>
                </div>
                <div>
                    <div class="stat-label">Total Revenue</div>
                    <div class="stat-value">Rs. ${data.revenue.toLocaleString()}</div>
                    <div class="stat-change positive">↑ 23% from last month</div>
                </div>
            </div>
        </div>

        <div class="card table-card">
            <div class="table-header-action">
                <h3 style="font-size: 1.2rem; font-weight: 700;">Recent Activity</h3>
                <button class="btn-secondary">View All</button>
            </div>
            <div style="padding: 20px; text-align: center; color: var(--text-muted);">
                <p>Select a module from the sidebar to view details.</p>
            </div>
        </div>
    `;
}

function initAnalyticsCharts(data) {
  const ctx = document.getElementById("mainChart").getContext("2d");
  const stockCtx = document.getElementById("stockChart").getContext("2d");

  // Gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "rgba(214, 41, 118, 0.5)"); // Brand Pink
  gradient.addColorStop(1, "rgba(214, 41, 118, 0.0)");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: data.chartData.labels,
      datasets: [
        {
          label: "Revenue",
          data: data.chartData.revenue,
          borderColor: "#d62976", // Brand Pink
          backgroundColor: gradient,
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: { grid: { borderDash: [5, 5] } },
        x: { grid: { display: false } },
      },
    },
  });

  // Calculate Stock
  const products = data.products || [];
  const inStock = products.filter((p) => p.stock > 10).length;
  const lowStock = products.filter((p) => p.stock <= 10 && p.stock > 0).length;
  const outStock = products.filter((p) => p.stock === 0).length;

  new Chart(stockCtx, {
    type: "doughnut",
    data: {
      labels: ["In Stock", "Low Stock", "Out of Stock"],
      datasets: [
        {
          data: [inStock, lowStock, outStock],
          backgroundColor: ["#10b981", "#f59e0b", "#ef4444"], // Success, Warning, Danger (Standard)
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

// User Module Functions
async function fetchUsers() {
  try {
    const res = await apiCall("http://localhost:4000/user/getUser");
    return res.data;
  } catch (e) {
    console.error("Failed to fetch users", e);
    return null;
  }
}

// User Management Template
function getUsersTemplate(users) {
  const userCount = users.length;
  const rows = users
    .map(
      (user, index) => `
        <tr>
            <td>#USR-${String(index + 1).padStart(3, "0")}</td>
            <td>${user.Firstname || user.name || "User"} ${user.Lastname || ""}</td>
            <td>${user.Email || user.email || "N/A"}</td>
            <td>${user.Phone || user.phone || "N/A"}</td>
            <td>${new Date(user.createdAt || Date.now()).toLocaleDateString()}</td>
            <td>
                <button id="deluser" onclick = "deleteUserbtn('${user._id}')" style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #e74c3c; color: white;">Delete</button>
            </td>
        </tr>
    `,
    )
    .join("");

  return `
        <div class="page-header">
            <h1 class="page-title">User Management</h1>
            <p class="page-subtitle">Manage and monitor all registered users</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card" style="--card-color: #d62976; --card-bg: rgba(214, 41, 118, 0.1)">
                <div class="stat-icon">👥</div>
                <div class="stat-label">Total Users</div>
                <div class="stat-value">${userCount}</div>
            </div>
        </div>

        <div class="card table-card">
            <div class="table-header">
             
                <div class="search-box-sm">
                    <span class="material-icons-round">search</span>
                    <input type="text" id="userSearch" placeholder="Search users...">
                </div>
            </div>
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Joined Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="userTableBody">${rows}</tbody>
                </table>
            </div>
        </div>
    `;
}

function setupUserSearch(allUsers) {
  const input = document.getElementById("userSearch");
  const tbody = document.getElementById("userTableBody");
  if (!input || !tbody) return;

  input.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allUsers.filter(
      (u) =>
        (u.Firstname && u.Firstname.toLowerCase().includes(term)) ||
        (u.Lastname && u.Lastname.toLowerCase().includes(term)) ||
        (u.Email && u.Email.toLowerCase().includes(term)) ||
        (u.name && u.name.toLowerCase().includes(term)),
    );
    tbody.innerHTML = filtered
      .map(
        (user, index) => `
            <tr>
                <td>#USR-${String(index + 1).padStart(3, "0")}</td>
                <td>${user.Firstname || user.name || "User"} ${user.Lastname || ""}</td>
                <td>${user.Email || user.email || "N/A"}</td>
                <td>${user.Phone || user.phone || "N/A"}</td>
                <td>${new Date(user.createdAt || Date.now()).toLocaleDateString()}</td>
                <td>
                    <button onclick="window.showToast('Edit feature coming soon', 'info')" style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #3498db; color: white;">Edit</button>
                    <button onclick="deleteUserbtn('${user._id}')" style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #e74c3c; color: white;">Delete</button>
                </td>
            </tr>
        `,
      )
      .join("");
  });
}

function generateAvatarColor(name) {
  const colors = [
    "#f1c40f",
    "#e67e22",
    "#e74c3c",
    "#9b59b6",
    "#3498db",
    "#1abc9c",
    "#2ecc71",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// Order Module Functions
async function fetchOrders() {
  try {
    return await apiCall("http://localhost:4000/order/All-orders");
  } catch (e) {
    console.error("Failed to fetch orders", e);
    return null;
  }
}

function getOrdersTemplate(orders) {
  const orderCount = orders.length;
  const completed = orders.filter((o) => o.orderStatus === "Delivered").length;
  const processing = orders.filter(
    (o) => o.orderStatus === "Processing",
  ).length;
  const pending = orders.filter(
    (o) => o.orderStatus === "Pending" || !o.orderStatus,
  ).length;

  const cards = orders
    .map((order) => {
      // Product safe handling
      const firstItem = order.items?.[0];
      const firstProductName =
        firstItem?.product?.product_name || "Product unavailable";

      // Truncate product name if too long
      const truncatedName = firstProductName.length > 20 ? firstProductName.substring(0, 20) + '...' : firstProductName;

      const productDisplay =
        order.items && order.items.length > 1
          ? `${truncatedName} + ${order.items.length - 1} more`
          : firstProductName;

      const totalQty = order.items
        ? order.items.reduce((acc, item) => acc + (item.quantity || 0), 0)
        : 0;

      // Status color
      const statusColor =
        order.orderStatus === "Delivered"
          ? "success"
          : order.orderStatus === "Processing"
            ? "info"
            : "pending";

      // User name safe handling
      const customerName = order.user
        ? `${order.user.Firstname || ""} ${order.user.Lastname || ""}`.trim() ||
          "Unknown"
        : "Unknown";

      return `
            <div class="data-card">
                <div class="card-header-row">
                    <div class="card-title-group">
                        <div class="card-icon" style="background: rgba(52, 152, 219, 0.1); color: #3498db;">🛍️</div>
                        <div class="card-main-info">
                            <h4>#ORD-${order._id.slice(0, 8).toUpperCase()}</h4>
                            <div class="card-sub-info">${new Date(order.createdAt).toLocaleDateString()}</div>
                        </div>
                    </div>
                    <span class="badge ${statusColor}">
                        ${order.orderStatus || "Pending"}
                    </span>
                </div>

                <div class="card-body">
                    <div class="info-row">
                        <span class="info-label">Customer</span>
                        <span class="info-value">${customerName}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Items</span>
                        <span class="info-value">${totalQty} Items</span>
                    </div>
                     <div class="info-row">
                        <span class="info-label">Product</span>
                        <span class="info-value" title="${firstProductName}">${productDisplay}</span>
                    </div>
                </div>

                <div class="card-footer">
                    <div class="price-tag">Rs. ${order.totalAmount || order.amount || 0}</div>
                    <button class="btn-primary-sm" onclick="viewOrder('${order._id}')">
                        View Details
                    </button>
                </div>
            </div>
        `;
    })
    .join("");

  return `
        <div class="page-header">
            <h1 class="page-title">Order Management</h1>
            <p class="page-subtitle">Track and manage all customer orders</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-label">Total Orders</div>
                <div class="stat-value">${orderCount}</div>
            </div>
            <div class="stat-card">
                <div class="stat-label">Completed</div>
                <div class="stat-value">${completed}</div>
            </div>
           
            <div class="stat-card">
                <div class="stat-label">Pending</div>
                <div class="stat-value">${pending}</div>
            </div>
        </div>

        <div class="grid-view">
            ${cards}
        </div>
    `;
}

// Category Module Functions
async function fetchCategories() {
  try {
    return await apiCall("http://localhost:4000/category/getCategories");
  } catch (e) {
    console.error("Failed to fetch categories", e);
    return null;
  }
}

// Category Management Template
function getCategoriesTemplate(categories) {
  const rows = categories
    .map(
      (cat) => `
        <tr>
            <td>${cat._id ? cat._id.slice(-10).toUpperCase() : "N/A"}</td>
            <td>${cat.name}</td>
        </tr>
    `,
    )
    .join("");

  return `
        <div class="page-header">
            <h1 class="page-title">Category Management</h1>
            <p class="page-subtitle">Organize and manage product categories</p>
        </div>
        <div class="card table-card">
            <div class="table-header-action">
                <div class="table-filters">
                    <input id="categoryInput" type="text" placeholder="Enter categories..." class="filter-input-wide">
                    <button id="addCategoryBtn" class="btn-primary-sm">Add New Category</button>
                </div>
            </div>
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Category ID</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody id="categoryTableBody">${rows}</tbody>
                </table>
            </div>
        </div>
    `;
}

// Product Module Functions
async function fetchProducts() {
  try {
    return await apiCall("http://localhost:4000/product/products");
  } catch (e) {
    console.error("Failed to fetch products", e);
    return null;
  }
}

// Product Management Template
function getProductsTemplate(products) {
  const productCount = products.length;
  const inStock = products.filter((p) => p.stock > 10).length;
  const lowStock = products.filter((p) => p.stock <= 10 && p.stock > 0).length;
  const outStock = products.filter((p) => p.stock === 0).length;

  const cards = products
    .map((p) => {
      const stockStatus =
        p.stock > 10 ? "success" : p.stock > 0 ? "warning" : "danger";
      const stockLabel =
        p.stock > 10 ? "In Stock" : p.stock > 0 ? "Low Stock" : "Out of Stock";

      return `
        <div class="data-card">
             <div class="card-header-row">
                <div class="card-title-group">
                     <div class="card-icon" style="background: rgba(250, 126, 30, 0.1); color: #fa7e1e;">📦</div>
                     <div class="card-main-info">
                        <h4>${p.product_name}</h4>
                        <div class="card-sub-info">${p.category ? p.category.name || p.category : "Uncategorized"}</div>
                    </div>
                </div>
                 <span class="badge ${stockStatus}">
                    ${stockLabel}
                </span>
             </div>

             <div class="card-body">
                <div class="info-row">
                    <span class="info-label">ID</span>
                    <span class="info-value">#PRD-${p._id ? p._id.slice(-6).toUpperCase() : "N/A"}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Stock</span>
                    <span class="info-value">${p.stock} Units</span>
                </div>
                 <div class="info-row">
                    <span class="info-label">Description</span>
                    <span class="info-value" title="${p.description}">${p.description ? p.description.substring(0, 20) + "..." : "-"}</span>
                </div>
            </div>

            <div class="card-footer">
                <div class="price-tag">Rs. ${p.price}</div>
                <div class="action-buttons" style="display: flex; gap: 8px;">
                    <button class="icon-btn-sm" title="Edit" onclick="editProduct('${p._id}')"><span class="material-icons-round">edit</span></button>
                    <button class="icon-btn-sm danger" title="Delete" onclick="deleteProduct('${p._id}')"><span class="material-icons-round">delete</span></button>
                </div>
            </div>
        </div>
    `;
    })
    .join("");

  return `
        <div class="page-header">
            <h1 class="page-title">Product Management</h1>
            <p class="page-subtitle">Manage your product inventory and listings</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card" style="--card-color: #fa7e1e; --card-bg: rgba(250, 126, 30, 0.1)">
                <div class="stat-icon">📦</div>
                <div class="stat-label">Total Products</div>
                <div class="stat-value">${productCount}</div>
            </div>
            <div class="stat-card" style="--card-color: #2ecc71; --card-bg: rgba(46, 204, 113, 0.1)">
                <div class="stat-icon">✅</div>
                <div class="stat-label">In Stock</div>
                <div class="stat-value">${inStock}</div>
            </div>
            <div class="stat-card" style="--card-color: #e74c3c; --card-bg: rgba(231, 76, 60, 0.1)">
                <div class="stat-icon">⚠️</div>
                <div class="stat-label">Low Stock</div>
                <div class="stat-value">${lowStock}</div>
                <div class="stat-change negative">Needs attention</div>
            </div>
            <div class="stat-card" style="--card-color: #95a5a6; --card-bg: rgba(149, 165, 166, 0.1)">
                <div class="stat-icon">❌</div>
                <div class="stat-label">Out of Stock</div>
                <div class="stat-value">${outStock}</div>
                <div class="stat-change negative">Restock needed</div>
            </div>
        </div>

        <div class="card table-card" style="margin-bottom: 20px; padding: 15px;">
            <div class="table-header-action" style="padding: 0; justify-content: space-between; display: flex;">
                 <div class="search-box-sm">
                        <span class="material-icons-round">search</span>
                        <input type="text" id="productSearch" placeholder="Search products...">
                    </div>
                    <button class="btn-primary-sm" onclick="window.location.href='/add-product'">
                        Add Product
                    </button>
            </div>
        </div>

        <div class="grid-view" id="productGrid">
            ${cards}
        </div>
    `;
}

function setupProductSearch(products) {
  const input = document.getElementById("productSearch");
  const grid = document.getElementById("productGrid");
  if (!input || !grid) return;

  input.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = products.filter((p) =>
      p.product_name.toLowerCase().includes(term),
    );
    
    grid.innerHTML = filtered
      .map((p) => {
        const stockStatus =
          p.stock > 10 ? "success" : p.stock > 0 ? "warning" : "danger";
        const stockLabel =
          p.stock > 10
            ? "In Stock"
            : p.stock > 0
              ? "Low Stock"
              : "Out of Stock";
        return `
        <div class="data-card">
             <div class="card-header-row">
                <div class="card-title-group">
                     <div class="card-icon" style="background: rgba(250, 126, 30, 0.1); color: #fa7e1e;">📦</div>
                     <div class="card-main-info">
                        <h4>${p.product_name}</h4>
                        <div class="card-sub-info">${p.category ? p.category.name || p.category : "Uncategorized"}</div>
                    </div>
                </div>
                 <span class="badge ${stockStatus}">
                    ${stockLabel}
                </span>
             </div>

             <div class="card-body">
                <div class="info-row">
                    <span class="info-label">ID</span>
                    <span class="info-value">#PRD-${p._id ? p._id.slice(-6).toUpperCase() : "N/A"}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Stock</span>
                    <span class="info-value">${p.stock} Units</span>
                </div>
                 <div class="info-row">
                    <span class="info-label">Description</span>
                    <span class="info-value" title="${p.description}">${p.description ? p.description.substring(0, 20) + "..." : "-"}</span>
                </div>
            </div>

            <div class="card-footer">
                <div class="price-tag">Rs. ${p.price}</div>
                <div class="action-buttons" style="display: flex; gap: 8px;">
                    <button class="icon-btn-sm" title="Edit" onclick="editProduct('${p._id}')"><span class="material-icons-round">edit</span></button>
                    <button class="icon-btn-sm danger" title="Delete" onclick="deleteProduct('${p._id}')"><span class="material-icons-round">delete</span></button>
                </div>
            </div>
        </div>
        `;
      })
      .join("");
  });
}

// Analytics Module Functions
async function fetchAnalyticsData() {
  try {
    const [analysisRes, productRes] = await Promise.all([
      apiCall("http://localhost:4000/admin/monthly-orders"),
      apiCall("http://localhost:4000/product/products"),
    ]);

    return {
      chartData: analysisRes.data,
      products: productRes.products,
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}

function getAnalyticsTemplate(data) {
  const revenue = data.chartData
    ? data.chartData.summary
      ? data.chartData.summary.totalRevenue
      : data.chartData.data?.revenue?.reduce((a, b) => a + b, 0) || 0
    : 0;
  const orderCount = data.chartData
    ? data.chartData.summary
      ? data.chartData.summary.totalOrders
      : data.chartData.data?.orders?.reduce((a, b) => a + b, 0) || 0
    : 0;
  const stockCount = data.products ? data.products.length : 0;
  const percentageChange = data.chartData?.summary?.ordersPercentageChange || 0;

  return `
        <div class="page-header">
            <h1 class="page-title">Analytics & Reports</h1>
            <p class="page-subtitle">Detailed performance metrics and trends</p>
        </div>

        <div class="stats-grid">
             <div class="stat-card" style="--card-color: #2ecc71; --card-bg: rgba(46, 204, 113, 0.1)">
                <div class="stat-header">
                    <div class="stat-icon">💰</div>
                </div>
                <div class="stat-label">Total Revenue</div>
                <div class="stat-value">Rs. ${revenue.toLocaleString()}</div>
                <div class="stat-change positive">↑ ${percentageChange}% from last month</div>
            </div>
             <div class="stat-card" style="--card-color: #bfa37c; --card-bg: rgba(191, 163, 124, 0.1)">
                <div class="stat-header">
                    <div class="stat-icon">🛒</div>
                </div>
                <div class="stat-label">Total Orders</div>
                <div class="stat-value">${orderCount}</div>
            </div>
             <div class="stat-card" style="--card-color: #fa7e1e; --card-bg: rgba(250, 126, 30, 0.1)">
                <div class="stat-header">
                    <div class="stat-icon">📦</div>
                </div>
                <div class="stat-label">Products In Stock</div>
                <div class="stat-value">${stockCount}</div>
            </div>
        </div>

        <div class="chart-section" style="grid-template-columns: 1fr;">
             <div class="chart-card">
                <div class="chart-header">
                    <h3 class="chart-title">Monthly Revenue & Orders</h3>
                </div>
                <div style="position: relative; height: 300px; width: 100%;">
                    <canvas id="analyticsMainChart"></canvas>
                </div>
            </div>
        </div>
        <div class="chart-section">
            <div class="chart-card">
                 <div class="chart-header">
                    <h3 class="chart-title">Order Distribution</h3>
                </div>
                <div style="position: relative; height: 300px; width: 100%;">
                    <canvas id="orderChart"></canvas>
                </div>
            </div>
        </div>
        
         <div class="chart-section">
            <div class="chart-card">
                 <div class="chart-header">
                    <h3 class="chart-title">Category Distribution</h3>
                </div>
                <div style="position: relative; height: 300px; width: 100%;">
                    <canvas id="categoryChart"></canvas>
                </div>
            </div>
        </div>
     `;
}

function initAnalyticsCharts(data) {
  const mainCtx = document
    .getElementById("analyticsMainChart")
    ?.getContext("2d");
  const catCtx = document.getElementById("categoryChart")?.getContext("2d");
  const ordersCtx = document.getElementById("orderChart")?.getContext("2d");

  const chartLabels = data.chartData?.data?.labels || [];
  const chartRevenue = data.chartData?.data?.revenue || [];
  const chartOrders = data.chartData?.data?.orders || [];

  // Main Revenue Chart - Beautiful Line Chart with Gradient
  if (mainCtx) {
    // Create gradient for area fill
    const revenueGradient = mainCtx.createLinearGradient(0, 0, 0, 300);
    revenueGradient.addColorStop(0, "rgba(214, 41, 118, 0.4)"); // Pink at top
    revenueGradient.addColorStop(1, "rgba(214, 41, 118, 0.05)"); // Almost transparent at bottom

    new Chart(mainCtx, {
      type: "line",
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: "Revenue",
            data: chartRevenue,
            borderColor: "#d62976", // Pink line
            backgroundColor: revenueGradient, // Gradient fill
            borderWidth: 3,
            fill: true,
            tension: 0.4, // Smooth curves
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: "#d62976",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointHoverBackgroundColor: "#d62976",
            pointHoverBorderColor: "#fff",
            pointHoverBorderWidth: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            display: false, // Hide legend like in the screenshot
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            padding: 12,
            titleFont: {
              size: 13,
              weight: "bold",
            },
            bodyFont: {
              size: 13,
            },
            borderColor: "#d62976",
            borderWidth: 1,
            displayColors: false,
            callbacks: {
              title: function (context) {
                return context[0].label;
              },
              label: function (context) {
                return "Revenue: Rs. " + context.parsed.y.toLocaleString();
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
              drawBorder: false,
            },
            ticks: {
              callback: function (value) {
                return "Rs. " + value.toLocaleString();
              },
              font: {
                size: 11,
              },
              color: "#666",
              padding: 8,
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 11,
              },
              color: "#666",
            },
          },
        },
      },
    });
  }

  if (ordersCtx) {
    // Create gradient for bars
    const ordersGradient = ordersCtx.createLinearGradient(0, 0, 0, 300);
    ordersGradient.addColorStop(0, 'rgba(250, 126, 30, 0.8)'); // Orange at top
    ordersGradient.addColorStop(1, 'rgba(250, 126, 30, 0.3)'); // Lighter at bottom

    new Chart(ordersCtx, {
      type: 'bar',
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: 'Orders',
            data: chartOrders,
            backgroundColor: ordersGradient,
            borderColor: '#fa7e1e',
            borderWidth: 2,
            borderRadius: 10,
            borderSkipped: false,
            barPercentage: 0.3,     // Makes bars narrower (default is 0.9)
          // categoryPercentage: 0.8 
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            padding: 12,
            titleFont: {
              size: 13,
              weight: 'bold',
            },
            bodyFont: {
              size: 13,
            },
            borderColor: '#fa7e1e',
            borderWidth: 1,
            displayColors: false,
            callbacks: {
              title: function(context) {
                return context[0].label;
              },
              label: function (context) {
                return 'Orders: ' + context.parsed.y.toLocaleString();
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false,
            },
            ticks: {
              callback: function (value) {
                return value.toLocaleString();
              },
              font: {
                size: 11,
              },
              color: '#666',
              padding: 8,
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 11,
              },
              color: '#666',
            },
          },
        },
      },
    });
  }

  // Category Distribution Chart
  if (catCtx && data.products) {
    const categoryCounts = {};
    data.products.forEach((p) => {
      const catName = p.category?.name || "Uncategorized";
      categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
    });

    new Chart(catCtx, {
      type: "doughnut",
      data: {
        labels: Object.keys(categoryCounts),
        datasets: [
          {
            data: Object.values(categoryCounts),
            backgroundColor: [
              "#6366f1", // Indigo
              "#8b5cf6", // Purple
              "#ec4899", // Pink
              "#f59e0b", // Orange
              "#10b981", // Green
              "#3b82f6", // Blue
              "#14b8a6", // Teal
              "#f97316", // Deep Orange
            ],
            borderColor: "#ffffff",
            borderWidth: 3,
            hoverOffset: 15,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
            labels: {
              padding: 15,
              font: {
                size: 12,
                weight: "600",
              },
              usePointStyle: true,
              pointStyle: "circle",
              generateLabels: function (chart) {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map((label, i) => {
                    const value = data.datasets[0].data[i];
                    const total = data.datasets[0].data.reduce(
                      (a, b) => a + b,
                      0,
                    );
                    const percentage = ((value / total) * 100).toFixed(1);
                    return {
                      text: `${label} (${percentage}%)`,
                      fillStyle: data.datasets[0].backgroundColor[i],
                      hidden: false,
                      index: i,
                    };
                  });
                }
                return [];
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            padding: 12,
            titleFont: {
              size: 14,
              weight: "bold",
            },
            bodyFont: {
              size: 13,
            },
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.parsed;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} products (${percentage}%)`;
              },
            },
          },
        },
        cutout: "65%",
      },
    });
  }
}
// Product Actions
window.editProduct = (id) => {
  window.location.href = `/add-product?id=${id}`;
};

window.deleteProduct = async (id) => {
  const confirmed = await showConfirm(
    "Delete Product",
    "Are you sure you want to delete this product? This action cannot be undone.",
  );

  if (!confirmed) return;

  try {
    const res = await fetch(`http://localhost:4000/product/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });

    if (res.ok) {
      showToast("Product deleted successfully", "success");
      // Refresh products
      renderView("products");
    } else {
      const data = await res.json();
      showToast(data.message || "Error deleting product", "error");
    }
  } catch (error) {
    console.error("Delete error:", error);
    showToast("Failed to delete product", "error");
  }
};

window.deleteUserbtn = async (id) => {
  const confirmed = await showConfirm(
    "Delete User",
    "Are you sure you want to delete this user? This action cannot be undone.",
  );
  if (!confirmed) return;
  try {
    const res = await fetch(`http://localhost:4000/user/delete-user/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });
    if (res.ok) {
      showToast("User deleted successfully", "success");
      // Refresh users
      renderView("users");
    } else {
      const data = await res.json();
      showToast(data.message || "Error deleting user", "error");
    }
  } catch (error) {
    console.error("Delete error:", error);
    showToast("Failed to delete user", "error");
  }
};

// Order Actions

window.viewOrder = async (id) => {
  try {
    const res = await apiCall(`http://localhost:4000/order/${id}`);
    if (!res || !res.data) {
      showToast("Order details not found", "error");
      return;
    }

    const order = res.data;
    console.log(order);
    const itemsList = order.items
      .map(
        (item) => `
            <div class="order-item-card">
                <div class="order-item-left">
                    <div class="order-item-img-placeholder">📦</div>
                    <div class="order-item-content">
                        <div class="order-item-name">${item.product?.product_name || "Product unavailable"}</div>
                        <div class="order-item-meta">Qty: ${item.quantity} × Rs. ${item.price}</div>
                    </div>
                </div>
                <div class="order-item-total">Rs. ${item.quantity * item.price}</div>
            </div>
        `,
      )
      .join("");

    const modalOverlay = document.createElement("div");
    modalOverlay.className = "confirm-modal-overlay show";
    modalOverlay.style.zIndex = "2000";

    modalOverlay.innerHTML = `
            <div class="confirm-modal order-details-modal">
                <div class="modal-header">
                    <h2>Order Details</h2>
                    <span class="material-icons-round" id="closeOrderModal" style="cursor: pointer;">close</span>
                </div>
                
                <div class="order-info-grid">
                    <div class="order-info-item">
                        <div class="info-label">Customer</div>
                        <div class="info-value">${order.user?.Firstname} ${order.user?.Lastname}</div>
                        <div class="info-meta text-xs text-muted">${order.user?.Email}</div>
                    </div>
                    <div class="order-info-item">
                        <div class="info-label">Order Date</div>
                        <div class="info-value">${new Date(order.createdAt).toLocaleDateString()}</div>
                        <div class="info-meta text-xs text-muted">${new Date(order.createdAt).toLocaleTimeString()}</div>
                    </div>
                    <div class="order-info-item">
                        <div class="info-label">Order ID</div>
                        <div class="info-value primary">#ORD-${order._id.toUpperCase()}</div>
                    </div>
                    <div class="order-info-item">
                        <div class="info-label">Status</div>
                        <div class="status-update-container">
                            <span class="badge ${order.orderStatus === "Delivered" ? "success" : "pending"}">${order.orderStatus || "Pending"}</span>
                            <select id="updateStatusSelect" class="status-select">
                                <option value="Pending" ${order.orderStatus === "Pending" ? "selected" : ""}>Pending</option>
                                <option value="Delivered" ${order.orderStatus === "Delivered" ? "selected" : ""}>Delivered</option>
                                <option value="Cancelled" ${order.orderStatus === "Cancelled" ? "selected" : ""}>Cancelled</option>
                            </select>
                            <button class="btn-primary-sm" id="saveStatusBtn" style="padding: 4px 10px; font-size: 11px;">Update</button>
                        </div>
                    </div>
                </div>

                <div class="order-items-section">
                    <div class="order-items-section-title">Order Items</div>
                    ${itemsList}
                </div>

                <div class="order-summary-footer">
                    <div class="total-row">
                        <span class="total-label">Total Amount</span>
                        <span class="total-amount">Rs. ${order.amount || 0}</span>
                    </div>
                </div>

                <div class="modal-actions">
                    <button class="confirm-modal-btn btn-cancel" id="closeOrderModalBtn">Close</button>
                </div>
            </div>
        `;

    document.body.appendChild(modalOverlay);

    const closeModal = () => {
      modalOverlay.classList.remove("show");
      setTimeout(() => modalOverlay.remove(), 300);
    };

    modalOverlay.querySelector("#closeOrderModal").onclick = closeModal;
    modalOverlay.querySelector("#closeOrderModalBtn").onclick = closeModal;

    modalOverlay.querySelector("#saveStatusBtn").onclick = async () => {
      const newStatus = modalOverlay.querySelector("#updateStatusSelect").value;
      if (newStatus === order.orderStatus) {
        showToast("Status is already " + newStatus, "info");
        return;
      }
      const success = await updateOrderStatus(order._id, newStatus);
      if (success) {
        closeModal();
        renderView("orders"); // Refresh the list
      }
    };

    modalOverlay.onclick = (e) => {
      if (e.target === modalOverlay) closeModal();
    };
  } catch (error) {
    console.error("Fetch order details error:", error);
    showToast("Failed to fetch order details", "error");
  }
};

window.updateOrderStatus = async (id, status) => {
  try {
    const res = await fetch(`http://localhost:4000/order/update-status/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    if (res.ok) {
      showToast("Order status updated successfully", "success");
      return true;
    } else {
      showToast(data.message || "Failed to update status", "error");
      return false;
    }
  } catch (error) {
    console.error("Update status error:", error);
    showToast("Error updating order status", "error");
    return false;
  }
};

// --- Notifications & Modals ---

window.showToast = (message, type = "info") => {
  const existingToast = document.querySelector(".toast");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  let icon = "info";
  if (type === "success") icon = "check_circle";
  if (type === "error") icon = "error";
  if (type === "warning") icon = "warning";

  toast.innerHTML = `
        <span class="material-icons-round toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
    `;

  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => toast.classList.add("show"), 100);

  // Auto remove
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

window.showConfirm = (title, message) => {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "confirm-modal-overlay";

    overlay.innerHTML = `
            <div class="confirm-modal">
                <div class="confirm-modal-title">${title}</div>
                <div class="confirm-modal-message">${message}</div>
                <div class="confirm-modal-actions">
                    <button class="confirm-modal-btn btn-cancel">Cancel</button>
                    <button class="confirm-modal-btn btn-confirm-danger">Delete</button>
                </div>
            </div>
        `;

    document.body.appendChild(overlay);

    // Animate in
    setTimeout(() => overlay.classList.add("show"), 10);

    const close = (result) => {
      overlay.classList.remove("show");
      setTimeout(() => {
        overlay.remove();
        resolve(result);
      }, 300);
    };

    overlay.querySelector(".btn-cancel").onclick = () => close(false);
    overlay.querySelector(".btn-confirm-danger").onclick = () => close(true);
    overlay.onclick = (e) => {
      if (e.target === overlay) close(false);
    };
  });
};
