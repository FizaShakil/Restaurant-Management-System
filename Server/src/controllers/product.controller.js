import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import connection from "../db/connection.js";

const addProductDetails = asyncHandler(async(req,res)=>{
    const product = req.body
    const addedProduct = await connection.execute(
        "INSERT into product (name, categoryId, description, price, status) VALUES(?,?,?,?,'true')",
        [product.name, product.categoryId,product.description,product.price]
    )

    if(!addedProduct){
        throw new ApiError(401, "Incomplete details")
    }
    return res.status(200)
    .json(
        new ApiResponse(200, product, "Product Deatils added successfully")
    )
})

const getProductDetails = asyncHandler(async (req, res) => {
  const [getDetails] = await connection.execute(
    `SELECT 
   p.id, p.name, p.description, p.price, p.status,
   c.id AS categoryId, c.name AS categoryName
   FROM product AS p
   LEFT JOIN category AS c ON p.categoryId = c.id;`
  );

   if(!getDetails){
        throw new ApiError(500, "Error fetching product details")
    }

  return res.status(200).json(
    new ApiResponse(200, getDetails, "Product details fetched successfully")
  );
});

// const getByCategoryId = asyncHandler(async(req,res)=>{
//     const id = req.params.id
//     const [getByCatId] = await connection.execute(
//         "SELECT id, name FROM product WHERE categoryId=? and status='true' ",
//         [id]
//     )
//     if(!getByCatId){
//         throw new ApiError(500, "Error in fetching product details by category ID")
//     }

//     return res.status(200)
//     .json(
//         new ApiResponse(200, getByCatId, "Products by category ID fetched successfully")
//     )
// })
const getAllCategories = asyncHandler(async (req, res) => {
  const [categories] = await connection.execute(
    "SELECT id, name FROM category"
  );

  if (!categories || categories.length === 0) {
    throw new ApiError(404, "No categories found");
  }

  return res.status(200).json(
    new ApiResponse(200, categories, "Categories fetched successfully")
  );
});


// Get By ID
const getById = asyncHandler(async(req,res)=>{
    const id = req.params.id
    const [getById] = await connection.execute(
        "SELECT id, name, description, price FROM product WHERE id=? ",
        [id]
    )
    if(!getById){
        throw new ApiError(500, "Error in fetching product details by product ID")
    }

    return res.status(200)
    .json(
        new ApiResponse(200, getById, "Products by product ID fetched successfully")
    )
})

const updateProductDetails = asyncHandler(async(req,res)=>{
    const product = req.body
    const [updateProduct] = await connection.execute(
        "UPDATE product SET name=?, categoryId=?, description=?, price=? WHERE id=? ",
        [product.name,product.categoryId, product.description, product.price,product.id]
    )
    if(updateProduct.affectedRows == 0){
        throw new ApiError(400, "Product ID doesnot exist")
    }
    
    return res.status(200)
    .json(
        new ApiResponse(200, product, "Product Details updated successfully! ")
    )
})

const deleteProduct = asyncHandler(async(req,res)=>{
    const id = req.params.id;
    const [deleteProduct] = await connection.execute(
        "DELETE from product WHERE id=?",
        [id]
    )
   if(deleteProduct.affectedRows == 0){
    throw new ApiError(400, "Product ID not found")
   }

   return res.status(200)
   .json(
    new ApiResponse(200, deleteProduct, "Product Deleted Successfully")
   )
})

const updateStatus = asyncHandler(async(req,res)=>{
    const product = req.body;
    const [updateUserStatus] = await connection.execute(
        "UPDATE product set status=? where id=?",
        [product.status, product.id]
    )
    if(updateUserStatus.affectedRows == 0){
    throw new ApiError(400, "Product ID not found")
   }
     return res.status(200)
   .json(
    new ApiResponse(200, updateUserStatus, "Product Status updated Successfully")
   )
})
export {addProductDetails, getProductDetails, getAllCategories, getById, updateProductDetails, deleteProduct, updateStatus}