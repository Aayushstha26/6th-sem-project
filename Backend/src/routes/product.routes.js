import {Router} from "express";
import { registerUser } from "../controller/user.controller.js";
import { addProduct  , getProducts} from "../controller/product.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { get } from "mongoose";


const router = Router();

router.route("/add").post(upload.single('productImg'),addProduct);
router.get("/products", getProducts);


export default router;