import { Product } from "../models/product.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { Apierror } from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addProduct = asyncHandler(async (req, res) => {
      const { product_name, description, price, category, stock } =
        req.body;
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

export { addProduct };
