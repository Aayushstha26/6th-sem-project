import { Router } from "express";
import { registerUser } from "../controller/user.controller.js";
import { addProduct, getProducts } from "../controller/product.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import path from "path";

const router = Router();

router.route("/add").post(upload.single("productImg"), addProduct);
router.route("/products").get(getProducts);
router.get("/product-page", (req, res) => {
  const productPath = path.resolve("../frontend/template/Products.html");
  res.sendFile(productPath);
});
router.route("/add-product").get((req, res) => {
  const addProductPath = path.resolve("../frontend/template/add-product.html");
  res.sendFile(addProductPath);
});

export default router;
