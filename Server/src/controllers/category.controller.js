import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import connection from "../db/connection.js";

const addCategory = asyncHandler(async(req, res)=>{
    const category = req.body;
    if(!category){
        throw new ApiError(401, "No complete category details provided")
    }
    const insertCategory = await connection.execute(
        "INSERT into category (name) VALUES(?)",
        [category.name]
    )
    if(!insertCategory){
        throw new ApiError(500, "Something went wrong while inserting category")
    }
    return res.status(200)
    .json(
       new ApiResponse(200, category, "Category added successfully! ")
    )
})

const getCategories = asyncHandler(async(req,res)=>{
    const [getCategory] = await connection.execute(
        "SELECT * from category ORDER BY name"
    )
    if(!getCategory){
        throw new ApiError(500, "Something went wrong while fetching categories")
    }

    return res.status(200)
    .json(
        new ApiResponse(200, getCategory, "Categories fetched successfully")
    )
})

const updateCategory = asyncHandler(async(req, res)=>{
    const product = req.body;
     if(!product){
        throw new ApiError(401, "No complete update details provided")
    }
    const[update] = await connection.execute(
        "UPDATE category SET name=? WHERE id=?",
        [product.name, product.id]
    )

    if(update.affectedRows == 0){
        throw new ApiError(500, "Category ID doesnot exist")
    }
   
    return res.status(200)
    .json(
        new ApiResponse(200, product, "Category Updated successfully")
    )

})

export {addCategory, getCategories, updateCategory}