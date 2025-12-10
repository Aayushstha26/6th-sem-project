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
router.get("/payment-success", (req, res) => {
  res.sendFile(path.resolve("../frontend/template/payment-success.html"));
});
router.get("/payment-failure",verifyJwt, (req, res) => {  
  res.sendFile(path.resolve("../frontend/template/payment-failure.html"));
});
router.get("/otp-verification", (req, res) => {
  res.sendFile(path.resolve("../frontend/template/otp-field.html"));
});
router.get("/forget-password", (req, res) => {
  res.sendFile(path.resolve("../frontend/template/forgot-pass.html"));
});
router.get("/reset-password", (req, res) => {
  res.sendFile(path.resolve("../frontend/template/reset-password.html"));
});
router.get("/change-password", (req, res) => {
  res.sendFile(path.resolve("../frontend/template/change-password.html"));
});

router.get("/admin-login", (req, res) => {
  res.sendFile(path.resolve("../frontend/template/Admin-login.html"));
});
router.get("/admin-dashboard", (req, res) => {
  res.sendFile(path.resolve("../frontend/template/Admin-dashboard.html"));
});

export default router;
