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
});

addProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  let addProductForm = document.getElementById("addProductForm");
  let productName = document.getElementById("productName");
  let productPrice = document.getElementById("productPrice");
  let productDesc = document.getElementById("productDesc");
  let productImage = document.getElementById("productImage"); // should be type="file"
  let productStock = document.getElementById("productStock");
  let formResults = document.getElementById("formResults");

  let category = document.getElementById("productCategory").value;
  console.log(category);
  try {
    // use FormData, not JSON
    const formData = new FormData();
    formData.append("product_name", productName.value);
    formData.append("price", productPrice.value);
    formData.append("description", productDesc.value);
    formData.append("category", category);
    formData.append("stock", productStock.value);

    // append the file (important!)
    if (productImage.files.length > 0) {
      formData.append("productImg", productImage.files[0]);
    }

    const req = await fetch("http://localhost:4000/product/add", {
      method: "POST",
      body: formData, // no need for headers, FormData sets it
    });

    const result = await req.json();
    formResults.innerHTML = result.message;

    if (req.ok) {
      formResults.style.color = "green";
      addProductForm.reset();
    } else {
      formResults.style.color = "red";
    }
  } catch (error) {
    formResults.innerHTML = "Error while submitting form";
    formResults.style.color = "red";
    console.error(error);
  }
});
