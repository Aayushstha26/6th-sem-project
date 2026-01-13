# Aava Treasures – Admin Page Plan

## 1. Admin Panel Overview

**Purpose:**
The Admin Panel allows the administrator to **control, manage, and monitor** the entire Aava Treasures system from one place.

**Admin Responsibilities**

* Manage users
* Manage products & categories
* Track orders & payments
* Monitor website activity
* Ensure security & data integrity

---

## 2. Admin Authentication Module

**Features**

* Admin login (username/email + password)
* OTP verification (optional for extra security)
* Password hashing for security
* Session or token-based authentication

**Functions**

* Login
* Logout
* Forgot Password
* Change Password

---

## 3. Admin Dashboard (Main Page)

**Displayed Information**

* Total users
* Total products
* Total orders
* Total revenue
* Pending orders
* Low stock alerts

**Visual Elements**

* Statistic cards for quick overview
* Bar / pie charts for sales and orders
* Recent activity log

---

## 4. User Management Module

**Customer Management Features**

* View user list
* Search users (character matching search)
* View user details
* Activate / deactivate users
* Delete inactive or fake accounts

**Security Options**

* View login history (optional)
* Block suspicious accounts

---

## 5. Category Management Module

**Features**

* Add new categories (Rings, Necklaces, Earrings, Bracelets)
* Edit category name and description
* Upload category image
* Delete categories (only if no products are linked)

---

## 6. Product Management Module

**Features**

* Add new jewelry products
* Upload multiple product images
* Set price, discount, and stock quantity
* Assign product category
* Edit or delete products

**Additional Options**

* Mark products as *New Arrival*
* Show or hide products on the website

---

## 7. Order Management Module

**Order Functions**

* View all orders
* View detailed order information
* Update order status:

  * Pending
  * Processing
  * Shipped
  * Delivered
  * Cancelled

**Customer Details**

* View buyer information
* View delivery address

---

## 8. Payment Management Module

**Functions**

* View payment records
* Payment status tracking:

  * Pending
  * Paid
  * Failed
* eSewa payment verification
* Transaction ID tracking

---

## 9. Review & Feedback Management

**Features**

* View customer reviews
* Approve or reject reviews
* Delete inappropriate feedback
* Monitor product ratings

---

## 10. Inventory & Stock Management

**Features**

* View product stock levels
* Low stock notifications
* Update product quantity
* Automatically disable out-of-stock products

---

## 11. Reports & Analytics

**Available Reports**

* Daily sales report
* Monthly sales report
* Best-selling products
* User growth report
* Order summary

**Export Options**

* PDF
* Excel (optional)

---

## 12. Website Content Management

**Manage Website Sections**

* Homepage banners
* New Arrivals section
* About Us content
* Contact information

---

## 13. Admin Settings

**Settings Options**

* Admin profile management
* Change admin password
* Website logo and theme color
* Tax and delivery charge configuration

---

## 14. Security & Activity Logs

**Security Features**

* Admin activity logs
* Failed login attempt tracking
* Data backup (optional)

---

## 15. Admin Logout

* Clear session or authentication token
* Automatic logout after inactivity

---

## Suggested Admin Navigation Structure

```text
Dashboard
Users
Categories
Products
Orders
Payments
Inventory
Reviews
Reports
Website Settings
Security Logs
Logout
```

---

## Optional Technology Stack

* **Frontend:** HTML, CSS, JavaScript (or React)
* **Backend:** Node.js + Express
* **Database:** MongoDB
* **Authentication:** JWT + OTP
* **Payment Gateway:** eSewa

---

*Project Name: Aava Treasures*

note: there is already admin page files donot make changes in those files create seperate files
note: also make sure to use the same database and collection names
note: also make sure to use the same api endpoints
note: also make sure not to use react only html css and js 
note: code should be clearer and understandable dynamic as well
