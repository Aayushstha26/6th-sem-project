import { Product } from "../models/product.model";
import asyncHandler from "../utils/asyncHandler";
import { Apierror } from "../utils/apiError";

const addProduct = asyncHandler(async (req, res) => {
      const { product_name, description, price, category, image_url, stock } =
        req.body;

      if (!product_name || !description || !price || !category || !image_url) {
              throw new Apierror(400, "All field are required");
          
      }

      const newProduct = new Product({
        product_name,
        description,
        price,
        category,
        image_url,
        stock,
      });
  
});

export { addProduct };
