import {Router} from 'express'
import authenticateToken from '../middlewares/auth.middleware.js'
import { deleteBill, generateReport, getBills, getPdf } from '../controllers/bill.controller.js'

const billRouter = Router()

billRouter.post('/generate-report', authenticateToken, generateReport)
billRouter.get('/get-pdf', authenticateToken, getPdf)
billRouter.get('/get-bills', authenticateToken, getBills)
billRouter.delete('/delete-bill/:id', authenticateToken, deleteBill)

export default billRouter