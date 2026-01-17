import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Apierror } from "../utils/apiError.js";
import { Apiresponse } from "../utils/apiRespone.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { customSearchFunction } from "../utils/customSearchFunction.js";
import {
  addOrUpdateRating,
  isValidRating,
  calculateAverageRating,
} from "../utils/customRatingFunction.js";
import { getTopRatedProductsManual } from "../utils/customTopRatedFunction.js";

const addProduct = asyncHandler(async (req, res) => {
  const { product_name, description, price, category, stock } = req.body;
  // console.log(req.body);
  // console.log(req.file);
  if (!product_name || !description || !price || !category) {
    throw new Apierror(400, "All field are required");
  }
  const productLocalPath = req.file.path;
  // console.log(productLocalPath);
  const productImg = await uploadOnCloudinary(productLocalPath);
  // console.log(productImg);
  if (!productImg) {
    throw new Apierror(500, "Error while uploading image");
  }

  const newProduct = await Product.create({
    product_name,
    description,
    price,
    category,
    productImg: productImg.url,
    stock: stock || 0,
  });
  return res.status(201).json({
    message: "Product added successfully",
  });
});
const getProducts = asyncHandler(async (req, res) => {
  const { category } = req.query;
  let filter = {};
  if (category) {
    const cat = await Category.findOne({
      name: { $regex: new RegExp("^" + category.trim() + "$", "i") },
    });
    filter.category = cat?._id;
  }
  const products = await Product.find(filter)
  .populate("category", "name")
  .populate({
    path: "ratings.user",
    select: "Firstname Lastname"
  })
  .sort({ createdAt: -1 });
  // if (search && search.trim()) {
  //   const searchTerm = search.trim().toLowerCase();

  //   products = products.filter((product) => {
  //     const productName = (product.product_name || "").toLowerCase();
  //     const description = (product.description || "").toLowerCase();

  //     return (
  //       customSearchFunction(productName, searchTerm) ||
  //       customSearchFunction(description, searchTerm)
  //     );
  //   });
  // }
  return res.status(200).json({
    results: products.length,
    products,
  });
});
const searchProducts = asyncHandler(async (req, res) => {
  const { search } = req.body;
  console.log(search);
  if (!search || !search.trim()) {
    throw new Apierror(400, "Search term is required");
  }
  const searchTerm = search.trim().toLowerCase();
  let products = await Product.find()
    .populate("category", "name")
    .populate({
      path: "ratings.user",
      select: "Firstname Lastname",
    });
  if (!products || products.length === 0) {
    return res.status(200).json({
      results: 0,
      products: [],
    });
  }
  products = products.filter((product) => {
    const productName = (product.product_name || "").toLowerCase();
    const description = (product.description || "").toLowerCase();
    return (
      customSearchFunction(productName, searchTerm) ||
      customSearchFunction(description, searchTerm)
    );
  });
  console.log("Filtered products:", products);

  return res.status(200).json({
    results: products.length,
    products,
  });
});
const getNewArrivals = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate("category")
    .populate({
      path: "ratings.user",
      select: "Firstname Lastname",
    })
    .sort({ createdAt: -1 })
    .limit(10);
  return res.status(200).json({
    results: products.length,
    products,
  });
});
const getTopRatedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .populate("category")
    .populate({
      path: "ratings.user",
      select: "Firstname Lastname",
    });
  
  const topRatedProducts = getTopRatedProductsManual(products, 5);

  return res.status(200).json({
    results: topRatedProducts.length,
    products: topRatedProducts,
  });
});
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id)
    .populate("category", "name")
    .populate({
      path: "ratings.user",
      select: "Firstname Lastname",
    });
  if (!product) {
    throw new Apierror(404, "Product not found");
  }
  return res.status(200).json({
    success: true,
    product,
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new Apierror(404, "Product not found");
  }
  return res
    .status(200)
    .json(new Apiresponse(200, "Product deleted successfully"));
});
const rateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, review } = req.body;
  const userId = req.user._id;
  if (!isValidRating(rating)) {
    throw new Apierror(400, "Rating must be an integer between 1 and 5");
  }
  const product = await Product.findById(id);
  if (!product) {
    throw new Apierror(404, "Product not found");
  }
  addOrUpdateRating(product.ratings, userId, rating, review);
  product.averageRating = calculateAverageRating(product.ratings);

  await product.save();
  return res
    .status(200)
    .json(new Apiresponse(200, "Product rated successfully"));
});

export {
  addProduct,
  getProducts,
  getNewArrivals,
  getTopRatedProducts,
  getProductById,
  deleteProduct,
  searchProducts,
  rateProduct,
};
