document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("categories-slots");
  if (!container) return;

  container.innerHTML = `<p>Loading categories...</p>`;

  try {
    const res = await fetch("http://localhost:4000/category/getCategories");
    if (!res.ok) throw new Error("Network response was not ok");

    const data = await res.json();
    const categories = data.data || [];

    if (!categories || categories.length === 0) {
      container.innerHTML = `<p>No categories available</p>`;
      return;
    }

    let html = "";
    categories.forEach(cat => {
      // Use category image if available, else a placeholder
      const imageUrl = cat.image || "../images/default-category.jpg";
      const encodedCategoryName = encodeURIComponent(cat.name);
      
      html += `
        <div class="category">
          <a href="/product-page?category=${encodedCategoryName}">
            <img src="${imageUrl}" alt="${cat.name}" />
          </a>
          <span>${cat.name}</span>
        </div>
      `;
    });

    container.innerHTML = html;

  } catch (err) {
    console.error("Error loading categories:", err);
    container.innerHTML = "<p style='color:red;'>⚠️ Failed to load categories.</p>";
  }
});
