import { Router } from "express";
import authenticateToken from "../middlewares/auth.middleware.js";
import checkRole from "../middlewares/checkrole.middleware.js";
import { addCategory, getCategories, updateCategory } from "../controllers/category.controller.js";

const categoryRouter = Router()

categoryRouter.post('/add-category-details', checkRole, addCategory)
categoryRouter.get('/get-category-details',  getCategories)
categoryRouter.patch('/update-category-details', checkRole, updateCategory)

export default categoryRouter