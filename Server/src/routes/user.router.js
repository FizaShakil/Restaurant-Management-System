import {Router} from 'express'
import { signup, login, adminSignup, getUserDetails, updateUserStatus, checkToken, changePassword } from '../controllers/user.controller.js'
import checkRole from '../middlewares/checkrole.middleware.js'
import authenticateToken from '../middlewares/auth.middleware.js'

const userRouter = Router()

userRouter.post('/signup', signup)
userRouter.post('/login', login)
userRouter.post('/admin-signup', adminSignup)
userRouter.get('/get-users-details', authenticateToken, checkRole, getUserDetails)
userRouter.patch('/update-user-status', authenticateToken, checkRole, updateUserStatus)
userRouter.get('/checktoken', authenticateToken, checkToken)
userRouter.post('/change-password', authenticateToken, changePassword)

export default userRouter 