import { Router } from "express";
import authenticateToken from "../middlewares/auth.middleware.js";
import checkRole from "../middlewares/checkrole.middleware.js";
import { addProductDetails, deleteProduct, getByCategoryId, getById, getProductDetails, updateProductDetails, updateStatus } from "../controllers/product.controller.js";

const productRouter = Router()

productRouter.post('/add-product-details', checkRole, addProductDetails)
productRouter.get('/get-product-details', getProductDetails)
// productRouter.get('/get-by-categoryid/:id', getByCategoryId)
productRouter.get('/get-all-categories', getAllCategories);
productRouter.get('/get-by-id/:id', authenticateToken, getById)
productRouter.patch('/update-product-details',checkRole, updateProductDetails)
productRouter.delete('/delete-product/:id', checkRole, deleteProduct)
productRouter.patch('/update-status', checkRole, updateStatus)


export default productRouter