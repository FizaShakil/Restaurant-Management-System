import express from "express"
import cors from "cors"
import userRouter from './routes/user.router.js'
import categoryRouter from "./routes/category.router.js"
import productRouter from "./routes/product.router.js"
import billRouter from "./routes/bill.router.js"
import dashboardRouter from "./routes/dashboard.router.js"
// import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({
    limit: "16kb"     // depends on server power
}))
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))
app.use(express.static("public"))

// app.use(cookieParser())

app.use("/api/v1/users" , userRouter)
app.use("/api/v1/categories", categoryRouter)
app.use("/api/v1/products", productRouter)
app.use("/api/v1/bills", billRouter)
app.use('/api/v1/dashboard',dashboardRouter)

export default app