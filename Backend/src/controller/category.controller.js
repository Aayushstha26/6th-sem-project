import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Apierror } from "../utils/apiError.js";
import { Apiresponse } from "../utils/apiRespone.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res
      .status(400)
      .json(new Apierror(400, "Category name is required"));
  }

  const existing = await Category.findOne({ name: name.trim() });
  if (existing) {
    return res
      .status(400)
      .json(new Apierror(400, "Category already exists"));
  }

  let imageUrl = "";
  if (req.file && req.file.path) {
    const uploadedImage = await uploadOnCloudinary(req.file.path);
    if (uploadedImage) {
      imageUrl = uploadedImage.url;
    }
  }

  const category = await Category.create({ 
    name: name.trim(),
    image: imageUrl
  });

  // Re-link orphaned products that previously had a category with this exact name
  await Product.updateMany(
    { oldCategoryName: category.name },
    { $set: { category: category._id }, $unset: { oldCategoryName: "" } }
  );

  return res
    .status(201)
    .json(new Apiresponse(201, "Category created successfully", category));
});
const getCategory = asyncHandler(async (req, res) => {
    const categories = await Category.find();
    return res.status(200).json(new Apiresponse(200, "Categories fetched successfully", categories));
});
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
        return res.status(404).json(new Apierror(404, "Category not found"));
    }

    // Keep track of the deleted category name on the orphaned products so they can be re-linked
    await Product.updateMany(
      { category: id },
      { $set: { oldCategoryName: category.name } }
    );

    return res.status(200).json(new Apiresponse(200, "Category deleted successfully", category));
}
);

export { addCategory , getCategory, deleteCategory };