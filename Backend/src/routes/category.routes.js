import { addCategory, getCategory , deleteCategory} from "../controller/category.controller.js";
import { Router } from "express";
const router = Router();


router.route("/addCategory").post(addCategory);
router.route("/getCategories").get(getCategory);
router.route("/deleteCategory/:id").delete(deleteCategory);

export default router;
