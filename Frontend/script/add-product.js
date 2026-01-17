document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("http://localhost:4000/category/getCategories");
    const result = await res.json();
    if (res.ok) {
      let categorySelect = document.getElementById("productCategory");
      result.data.forEach((cat) => {
        let option = document.createElement("option");
        option.value = cat._id;
        option.text = cat.name;
        categorySelect.appendChild(option);
        console.log(cat._id);
      });
    } else {
      console.error("Failed to fetch categories:", result.message);
    }
  } catch (error) {
    console.log("Error while fetching categories:", error);
  }

  // Handle Edit Mode
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (productId) {
    document.querySelector("h2").textContent = "Edit Product";
    document.querySelector(".submit-btn").textContent = "Update Product";
    const productImageInput = document.getElementById("productImage");
    productImageInput.required = false; // Make image optional for edit

    try {
      const res = await fetch(`http://localhost:4000/product/${productId}`);
      const data = await res.json();
      if (res.ok) {
        document.getElementById("productName").value = data.product.product_name;
        document.getElementById("productPrice").value = data.product.price;
        document.getElementById("productDesc").value = data.product.description;
        document.getElementById("productStock").value = data.product.stock;
        document.getElementById("productCategory").value = data.product.category._id || data.product.category;
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  }
});

let addProductForm = document.getElementById("addProductForm");
addProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  let productName = document.getElementById("productName");
  let productPrice = document.getElementById("productPrice");
  let productDesc = document.getElementById("productDesc");
  let productImage = document.getElementById("productImage");
  let productStock = document.getElementById("productStock");
  let formResults = document.getElementById("formResults");
  let category = document.getElementById("productCategory").value;

  try {
    const formData = new FormData();
    formData.append("product_name", productName.value);
    formData.append("price", productPrice.value);
    formData.append("description", productDesc.value);
    formData.append("category", category);
    formData.append("stock", productStock.value);

    if (productImage.files.length > 0) {
      formData.append("productImg", productImage.files[0]);
    }

    const url = productId 
      ? `http://localhost:4000/product/update/${productId}` 
      : "http://localhost:4000/product/add";
    
    const method = productId ? "PUT" : "POST";

    const req = await fetch(url, {
      method: method,
      body: formData,
    });

    const result = await req.json();
    
    if (req.ok) {
      showToast(productId ? "Product updated successfully!" : "Product added successfully!", "success");
      
      if (!productId) {
        addProductForm.reset();
      } else {
        setTimeout(() => {
          window.location.href = "/admin-v2/dashboard"; 
        }, 2000);
      }
    } else {
      showToast(result.message || "Error occurred", "error");
    }
  } catch (error) {
    showToast("Error while submitting form", "error");
    console.error(error);
  }
});

// Defining a fallback showToast if not globally available (though it should be if dashboard.js is loaded, 
// but add-product.html might be standalone).
function showToast(message, type = 'info') {
    // Check if parent window has showToast
    if (window.parent && window.parent.showToast) {
        window.parent.showToast(message, type);
        return;
    }
    
    // Local implementation for standalone add-product.html
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type} show`; // Force show since we don't have the fancy dashboard animations here easily without more CSS
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.padding = '16px 24px';
    toast.style.background = type === 'error' ? '#ef4444' : '#10b981';
    toast.style.color = 'white';
    toast.style.borderRadius = '8px';
    toast.style.zIndex = '10000';
    toast.innerHTML = message;

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}
