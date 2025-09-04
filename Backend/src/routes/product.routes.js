import {Router} from "express";
import { registerUser } from "../controller/user.controller";
import { registerProduct } from "../controller/product.controller";


const router = Router();

router.route().post(registerProduct);


export default router;