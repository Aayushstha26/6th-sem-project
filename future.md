 <!-- <div class="stat-card" style="--card-color: #2ecc71; --card-bg: rgba(46, 204, 113, 0.1)">
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
            </div> -->



          ////////////////////////////  payment////////////////////////
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

        ////////////////////////product mgmt///////////////////////////////////////////////
        <select style="padding: 8px 12px; border: 1px solid #e0e0e0; border-radius: 6px;">
                        <option>All Categories</option>
                        <option>Electronics</option>
                        <option>Clothing</option>
                        <option>Accessories</option>
                    </select>
                    
///////////////////////////////////////search//////////////////////////
 <div class="search-bar">
                    <input type="text" placeholder="Search for anything...">
                    <span class="search-icon">🔍</span>
                </div>



<!-- order -->


    <!-- Order Details Box -->
        <div style="background: #f9fafb; border-left: 4px solid #10b981; padding: 15px; margin: 25px 0; border-radius: 6px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #666; font-size: 14px;">Order Number:</span>
            <span style="color: #111; font-weight: 600;">#${orderId}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #666; font-size: 14px;">Order Date:</span>
            <span style="color: #111;">${orderDate}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #666; font-size: 14px;">Estimated Delivery:</span>
            <span style="color: #10b981; font-weight: 600;">${estimatedDelivery}</span>
          </div>
        </div>


          <!-- CTA Button -->
        <div style="text-align: center; margin: 30px 0 20px 0;">
          <a href="${process.env.FRONTEND_URL || 'https://yourstore.com'}/orders/${orderId}" 
             style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500;">
            Track Your Order
          </a>
        </div>
        
         <p style="color: #888; font-size: 13px; margin-top: 25px; text-align: center;">
          Questions? Contact our support team at ${process.env.SUPPORT_EMAIL || 'support@yourstore.com'}
        </p>


          <!-- Recommended Products Section -->
  <section class="recommended">
    <h2>Recommended for You</h2>
    <div class="recommended-container">
      <!-- Card 1 -->
      <div class="product-card" onclick="location.href='Product-details.html?id=101'">
        <div class="product-image-wrapper">
          <img src="../images/e-1.png" alt="Crystal Drop Earrings" />
        </div>
        <div class="product-info">
          <span class="product-name">Crystal Drop Earrings</span>
          <span class="product-category">Earrings</span>
          <p class="product-description">Elegant crystal earrings for special occasions.</p>
          <div class="product-stock in-stock">
            <span class="stock-indicator"></span>
            <span>In Stock (15 units)</span>
          </div>
          <div class="product-price-tag">
            <svg class="price-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
              <path
                d="M458.67 149.33L362.67 53.33C356.44 47.11 348.44 42.67 339.56 42.67H106.67C83.56 42.67 64 62.22 64 85.33V426.67C64 449.78 83.56 469.33 106.67 469.33H405.33C428.44 469.33 448 449.78 448 426.67V172.44C448 163.56 443.56 155.56 437.33 149.33H458.67Z"
                fill="#70C6A5" />
              <path
                d="M448 426.67V172.44C448 163.56 443.56 155.56 437.33 149.33L362.67 53.33C356.44 47.11 348.44 42.67 339.56 42.67H298.67V469.33H405.33C428.44 469.33 448 449.78 448 426.67Z"
                fill="#5FB89A" />
              <circle cx="384" cy="128" r="32" fill="white" />
              <path d="M480 32L384 128L416 160L512 64L480 32Z" fill="#F4D190" />
              <path d="M512 64L480 32L448 64V96L480 128L512 96V64Z" fill="#E6C077" />
            </svg>
            <span class="product-price">Rs. 1,200</span>
          </div>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="product-card" onclick="location.href='Product-details.html?id=102'">
        <div class="product-image-wrapper">
          <img src="../images/e-2.png" alt="Elegant Bracelet" />
        </div>
        <div class="product-info">
          <span class="product-name">Elegant Bracelet</span>
          <span class="product-category">Bracelet</span>
          <p class="product-description">A delicate bracelet with fine craftsmanship.</p>
          <div class="product-stock low-stock">
            <span class="stock-indicator"></span>
            <span>Low Stock (3 units)</span>
          </div>
          <div class="product-price-tag">
            <svg class="price-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
              <path
                d="M458.67 149.33L362.67 53.33C356.44 47.11 348.44 42.67 339.56 42.67H106.67C83.56 42.67 64 62.22 64 85.33V426.67C64 449.78 83.56 469.33 106.67 469.33H405.33C428.44 469.33 448 449.78 448 426.67V172.44C448 163.56 443.56 155.56 437.33 149.33H458.67Z"
                fill="#70C6A5" />
              <path
                d="M448 426.67V172.44C448 163.56 443.56 155.56 437.33 149.33L362.67 53.33C356.44 47.11 348.44 42.67 339.56 42.67H298.67V469.33H405.33C428.44 469.33 448 449.78 448 426.67Z"
                fill="#5FB89A" />
              <circle cx="384" cy="128" r="32" fill="white" />
              <path d="M480 32L384 128L416 160L512 64L480 32Z" fill="#F4D190" />
              <path d="M512 64L480 32L448 64V96L480 128L512 96V64Z" fill="#E6C077" />
            </svg>
            <span class="product-price">Rs. 2,800</span>
          </div>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="product-card" onclick="location.href='Product-details.html?id=103'">
        <div class="product-image-wrapper">
          <img src="../images/e-3.jpg" alt="Gold Plated Necklace" />
        </div>
        <div class="product-info">
          <span class="product-name">Gold Plated Necklace</span>
          <span class="product-category">Necklace</span>
          <p class="product-description">Premium gold plated necklace for daily wear.</p>
          <div class="product-stock in-stock">
            <span class="stock-indicator"></span>
            <span>In Stock (20 units)</span>
          </div>
          <div class="product-price-tag">
            <svg class="price-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
              <path
                d="M458.67 149.33L362.67 53.33C356.44 47.11 348.44 42.67 339.56 42.67H106.67C83.56 42.67 64 62.22 64 85.33V426.67C64 449.78 83.56 469.33 106.67 469.33H405.33C428.44 469.33 448 449.78 448 426.67V172.44C448 163.56 443.56 155.56 437.33 149.33H458.67Z"
                fill="#70C6A5" />
              <path
                d="M448 426.67V172.44C448 163.56 443.56 155.56 437.33 149.33L362.67 53.33C356.44 47.11 348.44 42.67 339.56 42.67H298.67V469.33H405.33C428.44 469.33 448 449.78 448 426.67Z"
                fill="#5FB89A" />
              <circle cx="384" cy="128" r="32" fill="white" />
              <path d="M480 32L384 128L416 160L512 64L480 32Z" fill="#F4D190" />
              <path d="M512 64L480 32L448 64V96L480 128L512 96V64Z" fill="#E6C077" />
            </svg>
            <span class="product-price">Rs. 4,000</span>
          </div>
        </div>
      </div>

      <!-- Card 4 -->
      <div class="product-card" onclick="location.href='Product-details.html?id=104'">
        <div class="product-image-wrapper">
          <img src="../images/e-4.jpg" alt="Diamond Cut Ring" />
        </div>
        <div class="product-info">
          <span class="product-name">Diamond Cut Ring</span>
          <span class="product-category">Rings</span>
          <p class="product-description">Exquisite diamond cut ring design.</p>
          <div class="product-stock out-of-stock">
            <span class="stock-indicator"></span>
            <span>Out of Stock</span>
          </div>
          <div class="product-price-tag">
            <svg class="price-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
              <path
                d="M458.67 149.33L362.67 53.33C356.44 47.11 348.44 42.67 339.56 42.67H106.67C83.56 42.67 64 62.22 64 85.33V426.67C64 449.78 83.56 469.33 106.67 469.33H405.33C428.44 469.33 448 449.78 448 426.67V172.44C448 163.56 443.56 155.56 437.33 149.33H458.67Z"
                fill="#70C6A5" />
              <path
                d="M448 426.67V172.44C448 163.56 443.56 155.56 437.33 149.33L362.67 53.33C356.44 47.11 348.44 42.67 339.56 42.67H298.67V469.33H405.33C428.44 469.33 448 449.78 448 426.67Z"
                fill="#5FB89A" />
              <circle cx="384" cy="128" r="32" fill="white" />
              <path d="M480 32L384 128L416 160L512 64L480 32Z" fill="#F4D190" />
              <path d="M512 64L480 32L448 64V96L480 128L512 96V64Z" fill="#E6C077" />
            </svg>
            <span class="product-price">Rs. 3,500</span>
          </div>
        </div>
      </div>
    </div>
  </section>