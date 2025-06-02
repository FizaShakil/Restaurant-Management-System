import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from '../utils/ApiResponse.js'
import { asyncHandler } from "../utils/asyncHandler.js";
import connection from "../db/connection.js";

const getAllDetails = asyncHandler(async(req,res)=>{
    var categoryCount;
    var productCount;
    var billCount;

    const [category] = await connection.execute(
        'SELECT count(id) as categoryCount from category' 
    )
    categoryCount = category[0].categoryCount

    if(categoryCount === undefined){
        throw new ApiError(500, "Categories count not fetched")
    }

    const [product] = await connection.execute(
        'SELECT count(id) as productCount from product'
    )
    productCount = product[0].productCount
    if(productCount === undefined){
        throw new ApiError(500, "Product count not fetched")
    }

     const [bill] = await connection.execute(
        'SELECT count(id) as billCount from bill'
    )
    billCount = bill[0].billCount
    if(billCount === undefined){
        throw new ApiError(500, "Bills count not fetched")
    }

    return res.status(200)
    .json(
        new ApiResponse(200, {
            categorySum:categoryCount,
            productSum:productCount,
            billSum: billCount
        },
        "All details/counts fetched successfully! "
    )
    )

})

export {getAllDetails}