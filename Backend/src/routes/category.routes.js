import { addCategory, getCategory , deleteCategory} from "../controller/category.controller.js";
import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
const router = Router();


router.route("/addCategory").post(upload.single("image"), addCategory);
router.route("/getCategories").get(getCategory);
router.route("/deleteCategory/:id").delete(deleteCategory);

export default router;
