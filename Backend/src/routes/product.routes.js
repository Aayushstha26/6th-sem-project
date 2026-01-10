import { Router } from "express";
import { registerUser } from "../controller/user.controller.js";
import {
  addProduct,
  getProducts,
  getNewArrivals,
  getProductById,
  deleteProduct,
  searchProducts,
  rateProduct,
} from "../controller/product.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import path from "path";
import { verifyJwt } from "../middleware/auth.midlleware.js";

const router = Router();

router.route("/add").post(upload.single("productImg"), addProduct);
router.route("/products").get(getProducts);
router.route("/new-arrivals").get(getNewArrivals);
router.route("/search").post(searchProducts);
router.route("/:id").get(getProductById);
router.route("/delete/:id").delete(deleteProduct);
router.route("/rate/:id").post( verifyJwt,rateProduct);
// router.get("/product-page", (req, res) => {
//   const productPath = path.resolve("../frontend/template/Products.html");
//   res.sendFile(productPath);
// });
// router.route("/add-product").get((req, res) => {
//   const addProductPath = path.resolve("../frontend/template/add-product.html");
//   res.sendFile(addProductPath);
// });

export default router;
