// routes/page.routes.js
import { Router } from "express";
import path from "path";
const router = Router();

router.get("/", (req, res) => {
  res.sendFile(path.resolve("../frontend/template/Homepage.html"));
});

router.get("/products", (req, res) => {
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
});

export default router;
