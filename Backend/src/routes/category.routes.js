import { addCategory, getCategory } from "../controller/category.controller.js";
import { Router } from "express";
const router = Router();


router.route("/addCategory").post(addCategory);
router.route("/getCategories").get(getCategory);

export default router;
