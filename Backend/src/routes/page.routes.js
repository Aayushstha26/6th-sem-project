// routes/page.routes.js
import { Router } from "express";
import path from "path";
import { verifyJwt } from "../middleware/auth.midlleware.js";
const router = Router();

router.get("/", (req, res) => {
  res.sendFile(path.resolve("../frontend/template/Homepage.html"));
});

router.get("/product-page", (req, res) => {
  res.sendFile(path.resolve("../frontend/template/Products.html"));
});

router.get("/add-product", (req, res) => {
  res.sendFile(path.resolve("../frontend/template/add-product.html"));
});
router.get("/signup", (req, res) => {
  const registerPath = path.resolve("../frontend/template/Register.html");
  res.sendFile(registerPath);
});
router.get("/signin", (req, res) => {
  const registerPath = path.resolve("../frontend/template/login.html");
  res.sendFile(registerPath);
})
router.get("/dashboard", (req, res) => {
  res.sendFile(path.resolve("../frontend/template/user-dashboard.html"));
});
router.get("/cart",   (req, res) => {
  res.sendFile(path.resolve("../frontend/template/Add-to-cart.html"));
});
router.get("/product-details", (req, res) => {
  res.sendFile(path.resolve("../frontend/template/Product-details.html"));
});
router.get("/address", (req, res) => {
  res.sendFile(path.resolve("../frontend/template/Address.html"));
});


export default router;
