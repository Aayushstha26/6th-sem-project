import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controller/user.controller.js";
import path from "path";
import { verifyJwt } from "../middleware/auth.midlleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, logoutUser);
router.get("/signup", (req, res) => {
  const registerPath = path.resolve("../frontend/template/Register.html");
  res.sendFile(registerPath);
});
router.get("/signin", (req, res) => {
  const registerPath = path.resolve("../frontend/template/login.html");
  res.sendFile(registerPath);
});
// router.get("/",(req,res)=>{
//     const homepagePath = path.resolve("../frontend/template/Homepage.html");
//     res.sendFile(homepagePath);
// })

export default router;
