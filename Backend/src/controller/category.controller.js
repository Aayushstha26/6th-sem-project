import { Category } from "../models/category.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Apierror } from "../utils/apiError.js";
import { Apiresponse } from "../utils/apiRespone.js";

export const addCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

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

  const category = await Category.create({ name: name.trim(), description });

  return res
    .status(201)
    .json(new Apiresponse(201, "Category created successfully", category));
});
const getCategory = asyncHandler(async (req, res) => {
    const categories = await Category.find();
    return res.status(200).json(new Apiresponse(200, "Categories fetched successfully", categories));
});
export { addCategory , getCategory };