import { Router } from "express";
import authenticateToken from "../middlewares/auth.middleware.js";
import checkRole from "../middlewares/checkrole.middleware.js";
import { addProductDetails, deleteProduct, getByCategoryId, getById, getProductDetails, updateProductDetails, updateStatus } from "../controllers/product.controller.js";

const productRouter = Router()

productRouter.post('/add-product-details', authenticateToken, checkRole, addProductDetails)
productRouter.get('/get-product-details', authenticateToken, getProductDetails)
productRouter.get('/get-by-categoryid/:id', authenticateToken, getByCategoryId)
productRouter.get('/get-by-id/:id', authenticateToken, getById)
productRouter.patch('/update-product-details', authenticateToken, checkRole, updateProductDetails)
productRouter.delete('/delete-product/:id', authenticateToken, checkRole, deleteProduct)
productRouter.patch('/update-status', authenticateToken, checkRole, updateStatus)


export default productRouter