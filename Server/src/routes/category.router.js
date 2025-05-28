import { Router } from "express";
import authenticateToken from "../middlewares/auth.middleware.js";
import checkRole from "../middlewares/checkrole.middleware.js";
import { addCategory, getCategories, updateCategory } from "../controllers/category.controller.js";

const categoryRouter = Router()

categoryRouter.post('/add-category-details', authenticateToken, checkRole, addCategory)
categoryRouter.get('/get-category-details', authenticateToken, getCategories)
categoryRouter.patch('/update-category-details', authenticateToken, checkRole, updateCategory)

export default categoryRouter