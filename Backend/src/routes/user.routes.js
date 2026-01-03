import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getAllUsers,
  changePassword,
  deleteUser,
  updateUserInfo
  , getUserById,
  resetPassword,
} from "../controller/user.controller.js";
import path from "path";
import { verifyJwt } from "../middleware/auth.midlleware.js";
import {verifyAdminJwt} from "../middleware/admin_auth.middleware.js";  

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// router.get("/signup", (req, res) => {
//   const registerPath = path.resolve("../frontend/template/Register.html");
//   res.sendFile(registerPath);
// });
// router.get("/signin", (req, res) => {
//   const registerPath = path.resolve("../frontend/template/login.html");
//   res.sendFile(registerPath);
// });
// router.get("/",(req,res)=>{
//     const homepagePath = path.resolve("../frontend/template/Homepage.html");
//     res.sendFile(homepagePath);
// })

//secured route
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/getUser").get(getAllUsers);
router.route("/change-password").post( changePassword);
router.route("/delete-user/:id").delete(verifyAdminJwt, deleteUser);
router.route("/update-user").put(verifyJwt, updateUserInfo);
router.route("/get").get(verifyJwt, getUserById);
router.route("/reset-password").post(verifyJwt,resetPassword);
export default router;
