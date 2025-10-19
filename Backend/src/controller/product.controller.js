import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Apierror } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addProduct = asyncHandler(async (req, res) => {
      const { product_name, description, price, category, stock } = req.body;
        // console.log(req.body);
        // console.log(req.file);
      if (!product_name || !description || !price || !category ) {
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
        stock : stock || 0 ,
      });
      return res.status(201).json({
    message: "Product added successfully",
  });
  
});
const getProducts = asyncHandler(async (req, res) => {
  const {category , search } = req.query;
  let filter = {};    
  if(category){
    const cat = await Category.findOne({
     name: { $regex: new RegExp("^" + category.trim() + "$", "i") }
    }
    );
    filter.category = cat?._id;
  }
  if(search){
    filter.$or = [
     { product_name : { $regex: search, $options: "i" }},
     { description : { $regex: search, $options: "i" }}
    ]
  } 
  const products = await Product.find(filter).populate("category", "name").sort({createdAt: -1});
  return res.status(200).json({
    results: products.length,
    products
  });
}); 
const getNewArrivals = asyncHandler(async (req, res) => {
  const products = await Product.find().populate("category").sort({createdAt: -1}).limit(10);
  return res.status(200).json({ 
    results: products.length,
    products
  });
});
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate("category", "name");  
  if (!product) {
    throw new Apierror(404, "Product not found");
  } 
  return res.status(200).json({
    success: true,
    product
  });
});

export { addProduct , getProducts , getNewArrivals , getProductById};
