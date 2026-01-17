import {  showToast} from "./slider.js";

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  const quantityInput = document.getElementById("quantity");

  if (!productId) {
    console.error("❌ Product ID not found in URL");
    document.querySelector(".details-container").innerHTML =
      "<p>Product not found.</p>";
    return;
  }

  try {
    const res = await fetch(`http://localhost:4000/product/${productId}`);

    if (!res.ok) throw new Error("Network response was not ok");

    const data = await res.json();
    const product = data.product;
    console.log(product);

    if (!product) {
      document.querySelector(".details-container").innerHTML =
        "<p>Product not found in database.</p>";
      return;
    }

    const addToCartBtn = document.querySelector(".cart-btn");
    const buy = document.querySelector(".buy-btn");
    const quantity = Number(quantityInput.value) || 1;
    console.log("Requested quantity:", quantity);
    quantityInput.addEventListener("change", () => {
      let qty = Number(quantityInput.value) || 1;
      if (qty < 1) qty = 1;
      quantityInput.value = qty;
      // Update button states based on new quantity
      if (qty > product.stock) {
        addToCartBtn.disabled = true;
        buy.disabled = true;
        addToCartBtn.textContent = `Only ${product.stock} item available`;
        buy.textContent = `Only ${product.stock} item available`;
        addToCartBtn.style.cursor = "not-allowed";
        buy.style.cursor = "not-allowed";
        buy.style.fontSize = "14px";
        addToCartBtn.style.fontSize = "14px";
      } else {
        addToCartBtn.disabled = false;
        buy.disabled = false;
        addToCartBtn.textContent = "Add to Cart";
        buy.textContent = "Buy Now";
        addToCartBtn.style.cursor = "pointer";
        buy.style.cursor = "pointer";
      }
    });

    // CASE 1: Product completely out of stock
    if (product.stock <= 0) {
      addToCartBtn.disabled = true;
      addToCartBtn.textContent = "Out of Stock";
      buy.disabled = true;
      buy.textContent = "Out of Stock";
      buy.style.cursor = "not-allowed";
      addToCartBtn.style.cursor = "not-allowed";
    }
    // CASE 2: User quantity is more than available stock
    else if (quantity > product.stock) {
      addToCartBtn.disabled = true;
      buy.disabled = true;
      addToCartBtn.textContent = `Only ${product.stock} item available`;
      buy.textContent = `Only ${product.stock} item available`;
      addToCartBtn.style.cursor = "not-allowed";
      buy.style.cursor = "not-allowed";
    }
    // CASE 3: Everything is fine — enable button
    else {
      addToCartBtn.disabled = false;
      buy.disabled = false;
      addToCartBtn.textContent = "Add to Cart";
    }


    // ✅ Set product details safely
    document.querySelector(".product-image img").src =
      product.productImg || "../images/default.jpg";
    document.querySelector(".product-title").textContent = product.product_name;
    document.querySelector(".category").textContent =
      product.category?.name || "Uncategorized";
    document.querySelector(
      ".product-price"
    ).textContent = `RS. ${product.price}`;
    document.querySelector(".product-description").textContent =
      product.description;

    // --- Ratings & Reviews Logic ---
    loadReviews(product);

    const toggleReviewFormBtn = document.getElementById("toggleReviewFormBtn");
    const reviewFormContainer = document.getElementById("reviewFormContainer");
    const cancelReviewBtn = document.getElementById("cancelReviewBtn");
    const reviewForm = document.getElementById("reviewForm");

    if (toggleReviewFormBtn) {
      toggleReviewFormBtn.addEventListener("click", () => {
        reviewFormContainer.classList.remove("hidden");
        toggleReviewFormBtn.style.display = "none";
      });
    }

    if (cancelReviewBtn) {
      cancelReviewBtn.addEventListener("click", () => {
        reviewFormContainer.classList.add("hidden");
        toggleReviewFormBtn.style.display = "inline-block";
        reviewForm.reset();
      });
    }

    if (reviewForm) {
      reviewForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const rating = document.querySelector('input[name="rating"]:checked')?.value;
        const name = document.getElementById("reviewName").value;
        const comment = document.getElementById("reviewComment").value;

        if (!rating || !name || !comment) {
          alert("Please fill in all fields");
          return;
        }

        const newReview = {
          id: Date.now(),
          productId: productId,
          rating: parseInt(rating),
          name: name,
          comment: comment,
          date: new Date().toLocaleDateString()
        };

        saveReview(productId, newReview);
        reviewFormContainer.classList.add("hidden");
        toggleReviewFormBtn.style.display = "inline-block";
        reviewForm.reset();

        // Refresh reviews
        loadReviews(productId);
      });
    }
  } catch (err) {
    console.error("❌ Error loading product details:", err);
    document.querySelector(".details-container").innerHTML =
      "<p>Failed to load product details.</p>";
  }
});

function loadReviews(product) {
 const reviews = product.ratings || [];
  renderReviews(reviews);
  updateRatingSummary(reviews);
}

async function saveReview (productId, review) {
  // const reviews = JSON.parse(localStorage.getItem(`reviews_${productId}`)) || [];
  // reviews.unshift(review); // Add to top
  // localStorage.setItem(`reviews_${productId}`, JSON.stringify(reviews));
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`http://localhost:4000/product/rate/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      rating: review.rating,
      review: review.comment  
    })
  }).then((res)=> {
    res.json();
    showToast("Review submitted successfully", false);
    console.log("Review submitted successfully"); 
  }).catch(
    (err) => {
      console.error("Error submitting review:", err);
      showToast("Error submitting review", true);
    }
  );
}

function renderReviews(reviews) {
  const reviewsList = document.getElementById("reviewsList");
  if (!reviewsList) return;

  if (reviews.length === 0) {
    reviewsList.innerHTML = '<p style="color: #777; text-align: center; padding: 20px;">No reviews yet. Be the first to review!</p>';
    return;
  }

  reviewsList.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <span class="reviewer-name">${review.user.Firstname + " " + review.user.Lastname}</span>
                <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
            </div>
            <div class="review-stars">${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</div>
            <p class="review-text">${review.review}</p>
        </div>
    `).join("");
}

function updateRatingSummary(reviews) {
  const avgRatingEl = document.getElementById("avgRating");
  const avgStarsEl = document.getElementById("avgStars");
  const totalReviewsEl = document.getElementById("totalReviews");

  if (!avgRatingEl) return;

  const total = reviews.length;
  totalReviewsEl.textContent = total;

  if (total === 0) {
    avgRatingEl.textContent = "0.0";
    avgStarsEl.textContent = "★★★★★"; // Grey out via CSS if needed, or just leave as is
    // Reset bars
    [1, 2, 3, 4, 5].forEach(i => {
      document.getElementById(`bar${i}`).style.width = "0%";
      document.getElementById(`count${i}`).textContent = "0";
    });
    return;
  }

  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const avg = (sum / total).toFixed(1);

  avgRatingEl.textContent = avg;

  // Create visual star representation for avg
  const filledStars = Math.round(avg);
  avgStarsEl.textContent = "★".repeat(filledStars) + "☆".repeat(5 - filledStars);

  // Update bars
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(r => counts[r.rating]++);

  [1, 2, 3, 4, 5].forEach(i => {
    const percentage = (counts[i] / total) * 100;
    document.getElementById(`bar${i}`).style.width = `${percentage}%`;
    document.getElementById(`count${i}`).textContent = counts[i];
  });
}

