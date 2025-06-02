import {Router} from 'express'
import authenticateToken from '../middlewares/auth.middleware.js'
import {getAllDetails} from '../controllers/dashboard.controller.js'

const dashboardRouter = Router()

dashboardRouter.get('/get-details', authenticateToken, getAllDetails)

export default dashboardRouter