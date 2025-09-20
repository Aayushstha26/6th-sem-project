import {Router} from "express";
import { registerUser } from "../controller/user.controller.js";
import { addProduct } from "../controller/product.controller.js";
import { upload } from "../middleware/multer.middleware.js";


const router = Router();

router.route("/add").post(upload.single('productImg'),addProduct);


export default router;