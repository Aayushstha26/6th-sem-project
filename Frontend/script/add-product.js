// ============================================
// Global Variables
// ============================================
let isEditMode = false;
let productId = null;
let selectedFile = null;

// ============================================
// Initialize on Page Load
// ============================================
window.addEventListener("DOMContentLoaded", () => {
  checkEditMode();
  loadCategories();
  setupEventListeners();
});

// ============================================
// Check if Edit Mode
// ============================================
function checkEditMode() {
  const urlParams = new URLSearchParams(window.location.search);
  productId = urlParams.get("id");

  if (productId) {
    isEditMode = true;
    document.getElementById("pageTitle").textContent = "Edit Product";
    document.getElementById("submitBtnText").textContent = "Update Product";
    document.getElementById("productImage").required = false;
    loadProductData(productId);
  }
}

// ============================================
// Load Categories
// ============================================
async function loadCategories() {
  try {
    const res = await fetch("http://localhost:4000/category/getCategories");
    const result = await res.json();

    if (res.ok) {
      const categorySelect = document.getElementById("productCategory");
      result.data.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat._id;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
      });
    } else {
      showToast("Failed to load categories", "error");
    }
  } catch (error) {
    console.error("Error loading categories:", error);
    showToast("Error loading categories", "error");
  }
}

// ============================================
// Load Product Data (Edit Mode)
// ============================================
async function loadProductData(id) {
  showLoading(true);

  try {
    const res = await fetch(`http://localhost:4000/product/${id}`);
    const data = await res.json();

    if (res.ok) {
      const product = data.product;
      document.getElementById("productName").value = product.product_name;
      document.getElementById("productPrice").value = product.price;
      document.getElementById("productDesc").value = product.description || "";
      document.getElementById("productStock").value = product.stock;
      document.getElementById("productCategory").value =
        product.category._id || product.category;

      updateCharCount();

      if (product.productImg) {
        showImagePreview(product.productImg);
      }
    } else {
      showToast("Failed to load product data", "error");
    }
  } catch (error) {
    console.error("Error loading product:", error);
    showToast("Error loading product data", "error");
  } finally {
    showLoading(false);
  }
}

// ============================================
// Setup Event Listeners
// ============================================
function setupEventListeners() {
  const form = document.getElementById("addProductForm");
  const productName = document.getElementById("productName");
  const productCategory = document.getElementById("productCategory");
  const productPrice = document.getElementById("productPrice");
  const productStock = document.getElementById("productStock");
  const productDesc = document.getElementById("productDesc");

  // Form submission
  form.addEventListener("submit", handleFormSubmit);

  // Real-time validation on input
  productName.addEventListener("input", () => {
    checkValid(
      productName,
      productName.value.trim() !== "" && productName.value.trim().length >= 3,
      "Product name must be at least 3 characters"
    );
  });

  productCategory.addEventListener("change", () => {
    checkValid(
      productCategory,
      productCategory.value.trim() !== "",
      "Please select a category"
    );
  });

  productPrice.addEventListener("input", () => {
    checkValid(
      productPrice,
      productPrice.value.trim() !== "" && isValidPrice(productPrice.value.trim()),
      "Enter a valid price greater than 0"
    );
  });

  productStock.addEventListener("input", () => {
    checkValid(
      productStock,
      productStock.value.trim() !== "" && isValidStock(productStock.value.trim()),
      "Enter a valid whole number (0 or greater)"
    );
  });

  // Character count
  productDesc.addEventListener("input", updateCharCount);

  // Image upload
  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("productImage");

  dropZone.addEventListener("click", () => fileInput.click());
  document.getElementById("browseBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    fileInput.click();
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  });

  document
    .getElementById("removeImageBtn")
    .addEventListener("click", handleRemoveImage);

  // Drag and drop
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("drag-over");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("drag-over");
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("drag-over");
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  // Navigation
  document.getElementById("backBtn").addEventListener("click", handleBack);
  document.getElementById("cancelBtn").addEventListener("click", handleBack);
}

// ============================================
// Validation Functions
// ============================================
function checkValid(input, condition, errormessage) {
  if (condition) {
    setSuccess(input);
  } else {
    setError(input, errormessage);
  }
}

function setSuccess(input) {
  // Find the form-group parent (may be nested in input-wrapper or input-with-icon)
  let formGroup = input.closest('.form-group');
  const icon = formGroup.querySelector(".validation-icon");
  const errorMsg = formGroup.querySelector(".error-message");
  
  formGroup.classList.remove("error");
  formGroup.classList.add("success");
  input.classList.remove("error");
  
  if (icon) {
    icon.className = "validation-icon fas fa-check-circle";
  }
  
  if (errorMsg) {
    errorMsg.textContent = "";
    errorMsg.classList.remove("show");
  }
}

function setError(input, errormessage) {
  // Find the form-group parent (may be nested in input-wrapper or input-with-icon)
  let formGroup = input.closest('.form-group');
  const icon = formGroup.querySelector(".validation-icon");
  const errorMsg = formGroup.querySelector(".error-message");
  
  formGroup.classList.remove("success");
  formGroup.classList.add("error");
  input.classList.add("error");
  
  if (icon) {
    icon.className = "validation-icon fas fa-times-circle";
  }
  
  if (errorMsg) {
    errorMsg.textContent = errormessage;
    errorMsg.classList.add("show");
  }
}

function isValidPrice(price) {
  return !isNaN(price) && parseFloat(price) > 0;
}

function isValidStock(stock) {
  return !isNaN(stock) && parseInt(stock) >= 0 && Number.isInteger(parseFloat(stock));
}

function validateForm() {
  let isValid = true;
  
  const productName = document.getElementById("productName");
  const productCategory = document.getElementById("productCategory");
  const productPrice = document.getElementById("productPrice");
  const productStock = document.getElementById("productStock");

  // Validate all fields
  checkValid(
    productName,
    productName.value.trim() !== "" && productName.value.trim().length >= 3,
    "Product name must be at least 3 characters"
  );

  checkValid(
    productCategory,
    productCategory.value.trim() !== "",
    "Please select a category"
  );

  checkValid(
    productPrice,
    productPrice.value.trim() !== "" && isValidPrice(productPrice.value.trim()),
    "Enter a valid price greater than 0"
  );

  checkValid(
    productStock,
    productStock.value.trim() !== "" && isValidStock(productStock.value.trim()),
    "Enter a valid whole number (0 or greater)"
  );

  // Check if any field has error
  document.querySelectorAll(".form-group").forEach((group) => {
    if (group.classList.contains("error")) {
      isValid = false;
    }
  });

  // Check image for new products
  if (!isEditMode && !selectedFile && !document.getElementById("previewImg").src) {
    const imageError = document.getElementById("imageError");
    if (imageError) {
      imageError.textContent = "Product image is required";
      imageError.classList.add("show");
    }
    isValid = false;
  }

  // Check description length
  const descLength = document.getElementById("productDesc").value.length;
  if (descLength > 500) {
    const descError = document.getElementById("descError");
    if (descError) {
      descError.textContent = "Description must not exceed 500 characters";
      descError.classList.add("show");
    }
    isValid = false;
  }

  return isValid;
}

// ============================================
// Handle File Upload
// ============================================
function handleFile(file) {
  const imageError = document.getElementById("imageError");
  
  // Validate file type
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    if (imageError) {
      imageError.textContent = "Please upload JPG, PNG, or WEBP image";
      imageError.classList.add("show");
    }
    return;
  }

  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    if (imageError) {
      imageError.textContent = "Image size must be less than 5MB";
      imageError.classList.add("show");
    }
    return;
  }

  // Clear error
  if (imageError) {
    imageError.textContent = "";
    imageError.classList.remove("show");
  }

  selectedFile = file;

  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => showImagePreview(e.target.result);
  reader.readAsDataURL(file);
}

// ============================================
// Image Preview
// ============================================
function showImagePreview(src) {
  document.getElementById("previewImg").src = src;
  document.getElementById("dropZoneContent").style.display = "none";
  document.getElementById("imagePreview").style.display = "block";
}

function handleRemoveImage(e) {
  e.stopPropagation();
  selectedFile = null;
  document.getElementById("productImage").value = "";
  document.getElementById("previewImg").src = "";
  document.getElementById("dropZoneContent").style.display = "block";
  document.getElementById("imagePreview").style.display = "none";

  if (!isEditMode) {
    const imageError = document.getElementById("imageError");
    if (imageError) {
      imageError.textContent = "Product image is required";
      imageError.classList.add("show");
    }
  }
}

// ============================================
// Character Counter
// ============================================
function updateCharCount() {
  const desc = document.getElementById("productDesc");
  const charCount = document.getElementById("charCount");
  const length = desc.value.length;

  charCount.textContent = length;
  charCount.style.color = length > 500 ? "var(--danger)" : "var(--text-light)";
}

// ============================================
// Form Submission
// ============================================
async function handleFormSubmit(e) {
  e.preventDefault();

  if (!validateForm()) {
    showToast("Please fix the errors before submitting", "error");
    return;
  }

  showLoading(true);
  const submitBtn = document.getElementById("submitBtn");
  submitBtn.disabled = true;

  try {
    const formData = new FormData();
    formData.append("product_name", document.getElementById("productName").value.trim());
    formData.append("price", document.getElementById("productPrice").value);
    formData.append("description", document.getElementById("productDesc").value.trim());
    formData.append("category", document.getElementById("productCategory").value);
    formData.append("stock", document.getElementById("productStock").value);

    if (selectedFile) {
      formData.append("productImg", selectedFile);
    }

    const url = isEditMode
      ? `http://localhost:4000/product/update/${productId}`
      : "http://localhost:4000/product/add";

    const response = await fetch(url, {
      method: isEditMode ? "PUT" : "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      const message = isEditMode
        ? "Product updated successfully!"
        : "Product added successfully!";
      showToast(message, "success");

      if (!isEditMode) {
        setTimeout(() => {
          document.getElementById("addProductForm").reset();
          handleRemoveImage({ stopPropagation: () => {} });
          updateCharCount();
          // Clear all success/error states
          document.querySelectorAll(".form-group").forEach((group) => {
            group.classList.remove("success", "error");
          });
          document.querySelectorAll(".form-input, .form-select").forEach((input) => {
            input.classList.remove("error");
          });
        }, 1500);
      } else {
        setTimeout(() => {
          window.location.href = "/admin-v2/dashboard";
        }, 1500);
      }
    } else {
      showToast(result.message || "An error occurred", "error");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    showToast("Failed to submit form. Please try again.", "error");
  } finally {
    showLoading(false);
    submitBtn.disabled = false;
  }
}

// ============================================
// Navigation
// ============================================
function handleBack() {
  if (isEditMode) {
    window.location.href = "/admin-v2/dashboard";
    return;
  }

  const hasData =
    document.getElementById("productName").value ||
    document.getElementById("productPrice").value ||
    document.getElementById("productDesc").value ||
    selectedFile;

  if (hasData) {
    if (confirm("You have unsaved changes. Are you sure you want to leave?")) {
      window.history.back();
    }
  } else {
    window.history.back();
  }
}

// ============================================
// Loading Overlay
// ============================================
function showLoading(show) {
  const overlay = document.getElementById("loadingOverlay");
  if (show) {
    overlay.classList.add("active");
  } else {
    overlay.classList.remove("active");
  }
}
