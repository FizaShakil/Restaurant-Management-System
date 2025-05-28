import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const checkRole = asyncHandler(async(req,res,next)=>{
    if(res.locals.role == process.env.USER){
        throw new ApiError(401, "Error!")
    }
    else next()
})


export default checkRole