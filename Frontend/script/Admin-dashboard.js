 // Sidebar Toggle
let userCount = 0;
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const user= await fetch('http://localhost:4000/user/getUser', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        const userData = await user.json();
        console.log(userData);
        userCount = userData.data.length;
        
    } catch (error) {
        console.error('Error fetching user data:', error);
    }   
    try {
        const product = await fetch('http://localhost:4000/product/products', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        const productData = await product.json();
        console.log(productData);
         productCount = productData.products.length;
       console.log('Product Count:', productCount);
        
    } catch (error) {
        console.error('Error fetching user data:', error);
    }   
    try {
        const order = await fetch('http://localhost:4000/order/all-orders', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
            }
        });
        const orderData = await order.json();
        console.log(orderData);
         orderCount = orderData.data.length;
       console.log('Product Count:', productCount);
        
    } catch (error) {
        console.error('Error fetching user data:', error);
    }   


console.log('User Count:', userCount);
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');

        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
            
            // Mobile toggle
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('mobile-open');
            }
        });
        

// Navigation System
const navLinks = document.querySelectorAll('.nav-link');
const dashboardContent = document.querySelector('.dashboard-content');

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
                <div class="stat-change positive">↑ 8% from last month</div>
            </div>

            <div class="stat-card" style="--card-color: #bfa37c; --card-bg: rgba(191, 163, 124, 0.1)">
                <div class="stat-header">
                    <div class="stat-icon">🛒</div>
                </div>
                <div class="stat-label">Total Orders</div>
                <div class="stat-value">${orderCount}</div>
                <div class="stat-change positive">↑ 15% from last month</div>
            </div>

            <div class="stat-card" style="--card-color: #2ecc71; --card-bg: rgba(46, 204, 113, 0.1)">
                <div class="stat-header">
                    <div class="stat-icon">💰</div>
                </div>
                <div class="stat-label">Total Revenue</div>
                <div class="stat-value">$284.5K</div>
                <div class="stat-change positive">↑ 23% from last month</div>
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
                <div class="stat-change positive">↑ 12% this month</div>
            </div>
            <div class="stat-card" style="--card-color: #2ecc71; --card-bg: rgba(46, 204, 113, 0.1)">
                <div class="stat-icon">✅</div>
                <div class="stat-label">Active Users</div>
                <div class="stat-value">10,234</div>
                <div class="stat-change positive">↑ 8% this month</div>
            </div>
            <div class="stat-card" style="--card-color: #fa7e1e; --card-bg: rgba(250, 126, 30, 0.1)">
                <div class="stat-icon">🆕</div>
                <div class="stat-label">New Users</div>
                <div class="stat-value">1,284</div>
                <div class="stat-change positive">↑ 18% this month</div>
            </div>
            <div class="stat-card" style="--card-color: #e74c3c; --card-bg: rgba(231, 76, 60, 0.1)">
                <div class="stat-icon">⏸️</div>
                <div class="stat-label">Inactive Users</div>
                <div class="stat-value">2,224</div>
                <div class="stat-change negative">↓ 5% this month</div>
            </div>
        </div>

        <div class="table-card">
            <div class="table-header">
                <h3 class="table-title">All Users</h3>
                <div style="display: flex; gap: 10px;">
                    <input type="text" placeholder="Search users..." style="padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 6px;">
                    <button class="view-all-btn">Add New User</button>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>#USR-001</td>
                        <td>John Smith</td>
                        <td>john.smith@email.com</td>
                        <td>Customer</td>
                        <td><span class="status-badge status-completed">Active</span></td>
                        <td>Jan 15, 2024</td>
                        <td>
                            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #3498db; color: white;">Edit</button>
                            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #e74c3c; color: white;">Delete</button>
                        </td>
                    </tr>
                    <tr>
                        <td>#USR-002</td>
                        <td>Sarah Johnson</td>
                        <td>sarah.j@email.com</td>
                        <td>Customer</td>
                        <td><span class="status-badge status-completed">Active</span></td>
                        <td>Feb 20, 2024</td>
                        <td>
                            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #3498db; color: white;">Edit</button>
                            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #e74c3c; color: white;">Delete</button>
                        </td>
                    </tr>
                    <tr>
                        <td>#USR-003</td>
                        <td>Mike Davis</td>
                        <td>mike.d@email.com</td>
                        <td>Admin</td>
                        <td><span class="status-badge status-completed">Active</span></td>
                        <td>Mar 10, 2024</td>
                        <td>
                            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #3498db; color: white;">Edit</button>
                            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #e74c3c; color: white;">Delete</button>
                        </td>
                    </tr>
                    <tr>
                        <td>#USR-004</td>
                        <td>Emily Brown</td>
                        <td>emily.b@email.com</td>
                        <td>Customer</td>
                        <td><span class="status-badge status-pending">Inactive</span></td>
                        <td>Apr 5, 2024</td>
                        <td>
                            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #3498db; color: white;">Edit</button>
                            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #e74c3c; color: white;">Delete</button>
                        </td>
                    </tr>
                    <tr>
                        <td>#USR-005</td>
                        <td>David Wilson</td>
                        <td>david.w@email.com</td>
                        <td>Customer</td>
                        <td><span class="status-badge status-completed">Active</span></td>
                        <td>May 12, 2024</td>
                        <td>
                            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #3498db; color: white;">Edit</button>
                            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #e74c3c; color: white;">Delete</button>
                        </td>
                    </tr>
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
                <div class="stat-value">3,284</div>
                <div class="stat-change positive">↑ 8% this month</div>
            </div>
            <div class="stat-card" style="--card-color: #2ecc71; --card-bg: rgba(46, 204, 113, 0.1)">
                <div class="stat-icon">✅</div>
                <div class="stat-label">In Stock</div>
                <div class="stat-value">2,891</div>
                <div class="stat-change positive">88% availability</div>
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
                    <select style="padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 6px;">
                        <option>All Categories</option>
                        <option>Electronics</option>
                        <option>Clothing</option>
                        <option>Accessories</option>
                    </select>
                    <button class="view-all-btn">Add Product</button>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>#PRD-001</td>
                        <td>Wireless Headphones</td>
                        <td>Electronics</td>
                        <td>$199.99</td>
                        <td>156</td>
                        <td><span class="status-badge status-completed">In Stock</span></td>
                        <td>
                            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #3498db; color: white;">Edit</button>
                            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #e74c3c; color: white;">Delete</button>
                        </td>
                    </tr>
                    <tr>
                        <td>#PRD-002</td>
                        <td>Smart Watch</td>
                        <td>Electronics</td>
                        <td>$349.99</td>
                        <td>89</td>
                        <td><span class="status-badge status-completed">In Stock</span></td>
                        <td>
                            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #3498db; color: white;">Edit</button>
                            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #e74c3c; color: white;">Delete</button>
                        </td>
                    </tr>
                    <tr>
                        <td>#PRD-003</td>
                        <td>Laptop Stand</td>
                        <td>Accessories</td>
                        <td>$79.99</td>
                        <td>12</td>
                        <td><span class="status-badge status-processing">Low Stock</span></td>
                        <td>
                            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #3498db; color: white;">Edit</button>
                            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #e74c3c; color: white;">Delete</button>
                        </td>
                    </tr>
                    <tr>
                        <td>#PRD-004</td>
                        <td>Mechanical Keyboard</td>
                        <td>Electronics</td>
                        <td>$159.99</td>
                        <td>0</td>
                        <td><span class="status-badge status-pending">Out of Stock</span></td>
                        <td>
                            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #3498db; color: white;">Edit</button>
                            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #e74c3c; color: white;">Delete</button>
                        </td>
                    </tr>
                    <tr>
                        <td>#PRD-005</td>
                        <td>USB-C Hub</td>
                        <td>Accessories</td>
                        <td>$49.99</td>
                        <td>234</td>
                        <td><span class="status-badge status-completed">In Stock</span></td>
                        <td>
                            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #3498db; color: white;">Edit</button>
                            <button style="padding: 4px 8px; margin: 0 2px; border: none; border-radius: 4px; cursor: pointer; background: #e74c3c; color: white;">Delete</button>
                        </td>
                    </tr>
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
                <div class="stat-value">8,921</div>
                <div class="stat-change positive">↑ 15% this month</div>
            </div>
            <div class="stat-card" style="--card-color: #2ecc71; --card-bg: rgba(46, 204, 113, 0.1)">
                <div class="stat-icon">✅</div>
                <div class="stat-label">Completed</div>
                <div class="stat-value">7,145</div>
                <div class="stat-change positive">80% success rate</div>
            </div>
            <div class="stat-card" style="--card-color: #fa7e1e; --card-bg: rgba(250, 126, 30, 0.1)">
                <div class="stat-icon">⏳</div>
                <div class="stat-label">Processing</div>
                <div class="stat-value">1,234</div>
                <div class="stat-change">14% in progress</div>
            </div>
            <div class="stat-card" style="--card-color: #f39c12; --card-bg: rgba(243, 156, 18, 0.1)">
                <div class="stat-icon">📦</div>
                <div class="stat-label">Pending</div>
                <div class="stat-value">542</div>
                <div class="stat-change">6% awaiting</div>
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

        <div class="stats-grid">
            <div class="stat-card" style="--card-color: #2ecc71; --card-bg: rgba(46, 204, 113, 0.1)">
                <div class="stat-icon">💰</div>
                <div class="stat-label">Total Revenue</div>
                <div class="stat-value">$284.5K</div>
                <div class="stat-change positive">↑ 23% this month</div>
            </div>
            <div class="stat-card" style="--card-color: #3498db; --card-bg: rgba(52, 152, 219, 0.1)">
                <div class="stat-icon">✅</div>
                <div class="stat-label">Successful</div>
                <div class="stat-value">$271.3K</div>
                <div class="stat-change positive">95.4% success</div>
            </div>
            <div class="stat-card" style="--card-color: #f39c12; --card-bg: rgba(243, 156, 18, 0.1)">
                <div class="stat-icon">⏳</div>
                <div class="stat-label">Pending</div>
                <div class="stat-value">$8.9K</div>
                <div class="stat-change">3.1% pending</div>
            </div>
            <div class="stat-card" style="--card-color: #e74c3c; --card-bg: rgba(231, 76, 60, 0.1)">
                <div class="stat-icon">❌</div>
                <div class="stat-label">Failed</div>
                <div class="stat-value">$4.3K</div>
                <div class="stat-change negative">1.5% failed</div>
            </div>
        </div>

        <div class="table-card">
            <div class="table-header">
                <h3 class="table-title">Recent Transactions</h3>
                <div style="display: flex; gap: 10px;">
                    <select style="padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 6px;">
                        <option>All Payments</option>
                        <option>Successful</option>
                        <option>Pending</option>
                        <option>Failed</option>
                    </select>
                    <button class="view-all-btn">Export Report</button>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Transaction ID</th>
                        <th>Customer</th>
                        <th>Order ID</th>
                        <th>Amount</th>
                        <th>Payment Method</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>#TXN-00451</td>
                        <td>John Smith</td>
                        <td>#ORD-2024-001</td>
                        <td>$199.99</td>
                        <td>Credit Card</td>
                        <td><span class="status-badge status-completed">Success</span></td>
                        <td>Dec 8, 2025</td>
                    </tr>
                    <tr>
                        <td>#TXN-00452</td>
                        <td>Sarah Johnson</td>
                        <td>#ORD-2024-002</td>
                        <td>$699.98</td>
                            <td>PayPal</td>
                        <td><span class="status-badge status-completed">Success</span></td>
                        <td>Dec 8, 2025</td>
                    </tr>
                    <tr>
                        <td>#TXN-00453</td> 

                        <td>Mike Davis</td> 
                        <td>#ORD-2024-003</td>
                        <td>$79.99</td>
                        <td>Credit Card</td>
                        <td><span class="status-badge status-pending">Pending</span></td>
                        <td>Dec 7, 2025</td>
                    </tr>
               </body>
            </table>
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
                <tbody>

                    <tr>
                        <td>#CAT-001</td>
                        <td>Electronics</td>
                    </tr>
                    <tr>
                        <td>#CAT-002</td>
                        <td>Clothing</td>
                    </tr>

                </tbody>
            </table>
        </div>
    `     
};  

// Function to load content based on selected section
function loadContent(section) {

    dashboardContent.innerHTML = contentTemplates[section];
}
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.getAttribute('data-section');
        loadContent(section);
    }   
    );
});

// Load default content
loadContent('dashboard');  


});
document.querySelector('.dashboard-content').addEventListener('click', async (e) => {

  if (e.target.id === 'addCategoryBtn') {
    const input = document.getElementById('categoryInput');
    const name = input.value.trim();

    if (!name) return;

    const res = await fetch('http://localhost:4000/category/addCategory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify({ name })
    });

    if (res.ok) {
      alert('Category added');
      input.value = '';
    }
  }

});
