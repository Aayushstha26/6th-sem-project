

// Sidebar Toggle
let userCount = 0;
document.addEventListener("DOMContentLoaded", async () => {
  try {
    var userData = await api("http://localhost:4000/user/getUser");
    console.log(userData);
    userCount = userData.data.length;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
  try {
    var productData = await api("http://localhost:4000/product/products");
    console.log(productData);
    productCount = productData.products.length;
    console.log("Product Count:", productCount);
    stockcount = productData.products.filter((p=>p.stock>0)).length;
    console.log("Stock Count:", stockcount);

  } catch (error) {
    console.error("Error fetching user data:", error);
  }
  try {
    const orderData = await api("http://localhost:4000/order/All-orders");
    console.log(orderData);
    orderCount = orderData.data.length;
    console.log("Product Count:", productCount);
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
  try {
    var categoryData = await api(
      "http://localhost:4000/category/getCategories"
    );
    console.log(categoryData);
    categoryCount = categoryData.data.length;
    console.log("Category Count:", categoryCount);
  } catch (error) {
    console.error("Error fetching category data:", error);
  }
  var data = await loadMonthlyOrders();
  console.log(data);
  const revenue = data.revenue;
  const percentageChange = data.percentageChange;

  console.log("User Count:", userCount);
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("mainContent");

  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    mainContent.classList.toggle("expanded");

    // Mobile toggle
    if (window.innerWidth <= 768) {
      sidebar.classList.toggle("mobile-open");
    }
  });

  // Navigation System
  const navLinks = document.querySelectorAll(".nav-link");
  const dashboardContent = document.querySelector(".dashboard-content");

  // Content templates for each section
  const contentTemplates = {
    dashboard: `
        <div class="page-header">
            <h1 class="page-title">Dashboard Overview</h1>
            <p class="page-subtitle">Welcome back! Here's what's happening with Aava Treasures today.</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card" style="--card-color: #d62976; --card-bg: rgba(214, 41, 118, 0.1)">
                <div class="stat-header">
                    <div class="stat-icon">👥</div>
                </div>
                <div class="stat-label">Total Users</div>
                <div class="stat-value">${userCount}</div>
            </div>

            <div class="stat-card" style="--card-color: #fa7e1e; --card-bg: rgba(250, 126, 30, 0.1)">
                <div class="stat-header">
                    <div class="stat-icon">📦</div>
                </div>
                <div class="stat-label">Total Products</div>
                <div class="stat-value">${productCount}</div>
            </div>

            <div class="stat-card" style="--card-color: #bfa37c; --card-bg: rgba(191, 163, 124, 0.1)">
                <div class="stat-header">
                    <div class="stat-icon">🛒</div>
                </div>
                <div class="stat-label">Total Orders</div>
                <div class="stat-value">${orderCount}</div>
            </div>

            <div class="stat-card" style="--card-color: #2ecc71; --card-bg: rgba(46, 204, 113, 0.1)">
                <div class="stat-header">
                    <div class="stat-icon">💰</div>
                </div>
                <div class="stat-label">Total Revenue</div>
                <div class="stat-value">${revenue}</div>
                <div class="stat-change positive">↑ ${percentageChange} from last month</div>
            </div>
        </div>

        <div class="chart-section">
            <div class="chart-card">
                <div class="chart-header">
                    <h3 class="chart-title">Sales Overview</h3>
                    <select class="chart-filter">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>Last 3 Months</option>
                    </select>
                </div>
                <canvas id="salesChart" height="80"></canvas>
            </div>

            <div class="chart-card">
                <div class="chart-header">
                    <h3 class="chart-title">Order Summary</h3>
                </div>
                <canvas id="orderChart" height="260"></canvas>
            </div>
        </div>

        <div class="table-card">
            <div class="table-header">
                <h3 class="table-title">Recent Orders</h3>
                <button class="view-all-btn">View All</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>#ORD-2024-001</td>
                        <td>John Smith</td>
                        <td>Wireless Headphones</td>
                        <td>$199.99</td>
                        <td><span class="status-badge status-completed">Completed</span></td>
                        <td>Dec 8, 2025</td>
                    </tr>
                    <tr>
                        <td>#ORD-2024-002</td>
                        <td>Sarah Johnson</td>
                        <td>Smart Watch</td>
                        <td>$349.99</td>
                        <td><span class="status-badge status-processing">Processing</span></td>
                        <td>Dec 8, 2025</td>
                    </tr>
                    <tr>
                        <td>#ORD-2024-003</td>
                        <td>Mike Davis</td>
                        <td>Laptop Stand</td>
                        <td>$79.99</td>
                        <td><span class="status-badge status-pending">Pending</span></td>
                        <td>Dec 7, 2025</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,

    users: `
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

        <div class="table-card">
            <div class="table-header">
                <h3 class="table-title">All Users</h3>
                
            </div>
            <table>
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
                <tbody id= "userTableBody">
                   
                </tbody>
            </table>
        </div>
    `,

    products: `
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
                <div class="stat-value">2,891</div>
            </div>
            <div class="stat-card" style="--card-color: #e74c3c; --card-bg: rgba(231, 76, 60, 0.1)">
                <div class="stat-icon">⚠️</div>
                <div class="stat-label">Low Stock</div>
                <div class="stat-value">245</div>
                <div class="stat-change negative">Needs attention</div>
            </div>
            <div class="stat-card" style="--card-color: #95a5a6; --card-bg: rgba(149, 165, 166, 0.1)">
                <div class="stat-icon">❌</div>
                <div class="stat-label">Out of Stock</div>
                <div class="stat-value">148</div>
                <div class="stat-change negative">Restock needed</div>
            </div>
        </div>

        <div class="table-card">
            <div class="table-header">
                <h3 class="table-title">Product Inventory</h3>
                <div style="display: flex; gap: 10px;">
                    
                   <a href="/add-product"> <button class="view-all-btn">Add Product</button></a>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Name</th>
                        <th>description</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="productTableBody">
                   
                </tbody>
            </table>
        </div>
    `,

    orders: `
        <div class="page-header">
            <h1 class="page-title">Order Management</h1>
            <p class="page-subtitle">Track and manage all customer orders</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card" style="--card-color: #bfa37c; --card-bg: rgba(191, 163, 124, 0.1)">
                <div class="stat-icon">🛒</div>
                <div class="stat-label">Total Orders</div>
                <div class="stat-value">${orderCount}</div>
                
            </div>
            <div class="stat-card" style="--card-color: #2ecc71; --card-bg: rgba(46, 204, 113, 0.1)">
                <div class="stat-icon">✅</div>
                <div class="stat-label">Completed</div>
                <div class="stat-value">7,145</div>
                
            </div>
            <div class="stat-card" style="--card-color: #fa7e1e; --card-bg: rgba(250, 126, 30, 0.1)">
                <div class="stat-icon">⏳</div>
                <div class="stat-label">Processing</div>
                <div class="stat-value">1,234</div>
                
            </div>
            <div class="stat-card" style="--card-color: #f39c12; --card-bg: rgba(243, 156, 18, 0.1)">
                <div class="stat-icon">📦</div>
                <div class="stat-label">Pending</div>
                <div class="stat-value">542</div>
            
            </div>
        </div>

        <div class="table-card">
            <div class="table-header">
                <h3 class="table-title">All Orders</h3>
                <div style="display: flex; gap: 10px;">
                    <select style="padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 6px;">
                        <option>All Status</option>
                        <option>Completed</option>
                        <option>Processing</option>
                        <option>Pending</option>
                    </select>
                    <input type="date" style="padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 6px;">
                    <button class="view-all-btn">Export Orders</button>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>#ORD-2024-001</td>
                        <td>John Smith</td>
                        <td>Wireless Headphones</td>
                        <td>1</td>
                        <td>$199.99</td>
                        <td><span class="status-badge status-completed">Completed</span></td>
                        <td>Dec 8, 2025</td>
                        <td>
                            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #3498db; color: white;">View</button>
                        </td>
                    </tr>
                    <tr>
                        <td>#ORD-2024-002</td>
                        <td>Sarah Johnson</td>
                        <td>Smart Watch</td>
                        <td>2</td>
                        <td>$699.98</td>
                        <td><span class="status-badge status-processing">Processing</span></td>
                        <td>Dec 8, 2025</td>
                        <td>
                            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #3498db; color: white;">View</button>
                        </td>
                    </tr>
                    <tr>
                        <td>#ORD-2024-003</td>
                        <td>Mike Davis</td>
                        <td>Laptop Stand</td>
                        <td>1</td>
                        <td>$79.99</td>
                        <td><span class="status-badge status-pending">Pending</span></td>
                        <td>Dec 7, 2025</td>
                        <td>
                            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #3498db; color: white;">View</button>
                        </td>
                    </tr>
                    <tr>
                        <td>#ORD-2024-004</td>
                        <td>Emily Brown</td>
                        <td>Mechanical Keyboard</td>
                        <td>1</td>
                        <td>$159.99</td>
                        <td><span class="status-badge status-completed">Completed</span></td>
                        <td>Dec 7, 2025</td>
                        <td>
                            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #3498db; color: white;">View</button>
                        </td>
                    </tr>
                    <tr>
                        <td>#ORD-2024-005</td>
                        <td>David Wilson</td>
                        <td>USB-C Hub</td>
                        <td>3</td>
                        <td>$149.97</td>
                        <td><span class="status-badge status-completed">Completed</span></td>
                        <td>Dec 6, 2025</td>
                        <td>
                            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #3498db; color: white;">View</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,

    payments: `
        <div class="page-header">
            <h1 class="page-title">Payment Management</h1>
            <p class="page-subtitle">Monitor all transactions and payment activities</p>
        </div>
    `,
    categories: `
        <div class="page-header">
            <h1 class="page-title">Category Management</h1>
            <p class="page-subtitle">Organize and manage product categories</p>
        </div>
        <div class="table-card">
            <div class="table-header">
                <h3 class="table-title">All Categories</h3>
                <div style="display: flex; gap: 10px;">
                    <input id="categoryInput" type="text" placeholder="Enter categories..." style="width: 300px; padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 6px;">
                <button id="addCategoryBtn" class="view-all-btn">Add New Category</button>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Category ID</th>
                        <th>Name</th>   

                    </tr>
                </thead>
                      <tbody id="categoryTableBody"></tbody>

            </table>
        </div>
    `,
    analytics: `
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
                <div class="stat-value">${revenue}</div>
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
                <div class="stat-value">${stockcount}</div>
            </div>
        </div>

        <div class="chart-section" style="grid-template-columns: 1fr;">
             <div class="chart-card">
                <div class="chart-header">
                    <h3 class="chart-title">Monthly Revenue & Orders</h3>
                </div>
                <canvas id="analyticsMainChart" height="100"></canvas>
            </div>
        </div>
        
         <div class="chart-section">
            <div class="chart-card">
                 <div class="chart-header">
                    <h3 class="chart-title">Category Distribution</h3>
                </div>
                <canvas id="categoryChart" height="200"></canvas>
            </div>
        </div>
    `,
  };

  // Function to load content based on selected section
  function loadContent(section) {
    dashboardContent.innerHTML = contentTemplates[section];
  }
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const section = link.getAttribute("data-section");
      loadContent(section);
      if (section === "categories") {
        renderCategories(categoryData.data); // Clear existing categories
      }
      if (section === "users") {
        renderUserTable(userData.data); // Clear existing users
      }
      if (section === "products") {
        renderProductTable(productData.products); // Clear existing products
      }
      if (section === "analytics") {
          setTimeout(() => {
            renderAnalyticsCharts(data, productData.products);
          }, 0);
      }
    });
  });

  // Load default content
  loadContent("dashboard");
});
document
  .querySelector(".dashboard-content")
  .addEventListener("click", async (e) => {
    if (e.target.id === "addCategoryBtn") {
      const input = document.getElementById("categoryInput");
      const name = input.value.trim();

      if (!name) return;

      const res = await fetch("http://localhost:4000/category/addCategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        alert("Category added");
        input.value = "";
        renderCategories(categoryData.data);
      }
    }
  });

async function api(url) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
  return response.json();
}
function renderCategories(categories) {
  console.log(categories);
  const tbody = document.getElementById("categoryTableBody");
  if (!tbody) return;

  tbody.innerHTML = categories
    .map(
      (cat, index) => `
    <tr>
     <td>${cat._id.slice(-10).toUpperCase()}</td>
      <td>${cat.name}</td>
    </tr>
  `
    )
    .join("");
}
async function loadMonthlyOrders() {
  const res = await getMonthlyOrders();
  console.log(res);
  const labels = res.data.data.labels;
  const orders = res.data.data.orders;
  const revenue = res.data.data.revenue;
  const percentageChange = res.data.summary.ordersPercentageChange;
  console.log(labels, orders, revenue , percentageChange);
    return { labels, orders, revenue, percentageChange };
}
function getMonthlyOrders() {
  return api("http://localhost:4000/admin/monthly-orders");
}

function renderUserTable(users) {
  const tbody = document.getElementById("userTableBody");
  if (!tbody) return;
    tbody.innerHTML = users
    .map(
      (user, index) => `
    <tr>    
        <td>#USR-${String(index + 1).padStart(3, "0")}</td>
        <td>${user.Firstname +" "+ user.Lastname}</td>
        <td>${user.Email}</td>
        <td>${user.Phone || "N/A"}</td>
        <td>${new Date(user.createdAt).toLocaleDateString()}</td>
        <td>
            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #3498db; color: white;">Edit</button>
            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #e74c3c; color: white;">Delete</button>
        </td>   
    </tr>
  `
    )
    .join("");
}
function renderProductTable(products) {
  const tbody = document.getElementById("productTableBody");
  if (!tbody) return;
    tbody.innerHTML = products
    .map(
      (product, index) => `
    <tr>
        <td>#PRD-${String(index + 1).padStart(3, "0")}</td>
        <td>${product.product_name}</td>
        <td>${product.description}</td>
        <td>${product.category.name}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td>${product.stock}</td>
        <td><span class="status-badge status-completed">${product.stock > 0 ? "In Stock" : "Out of Stock"}</span></td>
        <td>
            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #3498db; color: white;">Edit</button>        
            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #e74c3c; color: white;">Delete</button>
        </td>
    </tr>   
        
    `   
    )
    .join("");
} 

function renderAnalyticsCharts(data, products) {
    const ctx = document.getElementById('analyticsMainChart');
    const catCtx = document.getElementById('categoryChart');
    
    if (ctx) {
        // Destroy existing chart if it exists attached to the canvas
        // Note: In vanilla JS without storing the chart instance, it's hard to destroy properly. 
        // A simple hack is to clone the node or check for status.
        // For this simple implementation, we'll assume the view re-renders fresh HTML each time.
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Revenue',
                        data: data.revenue,
                        backgroundColor: 'rgba(46, 204, 113, 0.5)',
                        borderColor: '#2ecc71',
                        borderWidth: 1,
                        yAxisID: 'y',
                    },
                    {
                        label: 'Orders',
                        data: data.orders,
                        backgroundColor: 'rgba(250, 126, 30, 0.5)',
                        borderColor: '#fa7e1e',
                        borderWidth: 1,
                        yAxisID: 'y1',
                        type: 'line'
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { display: true, text: 'Revenue ($)' }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false,
                        },
                         title: { display: true, text: 'Order Count' }
                    },
                }
            }
        });
    }

    if (catCtx && products) {
        // Calculate Category Distribution
        const categoryCounts = {};
        products.forEach(p => {
            const catName = p.category?.name || 'Uncategorized';
            categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
        });

        new Chart(catCtx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(categoryCounts),
                datasets: [{
                    data: Object.values(categoryCounts),
                    backgroundColor: [
                        '#d62976',
                        '#fa7e1e',
                        '#f39c12',
                        '#2ecc71',
                        '#3498db',
                        '#9b59b6'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        });
    }
} 

document.addEventListener("DOMContentLoaded", async () => {
    const nav_logout = document.querySelector(".nav-logout");

    nav_logout.addEventListener("click", () => {
        const res = fetch("http://localhost:4000/admin/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    }).then((response) => {
        if (!response.ok) {     
        throw new Error("Network response was not ok");
        }

      localStorage.removeItem("adminToken");
      window.location.href = "/admin-login";
    })
    .catch((error) => {
      console.error("Error during logout:", error); 
    });
    })
})