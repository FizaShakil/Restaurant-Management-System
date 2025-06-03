import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInstance"; // Your configured Axios instance
import { useNavigate } from "react-router-dom";
import HeadingMain from '../HeadingMain'

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    price: "",
    description: "",
    categoryId: "",
  });

  const navigate = useNavigate();

useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/products/get-all-categories");
      setCategories(res.data.data);
      console.log(res.data.data)
    } 
    catch (error) {
      console.log("Error fetching categories:", error);
      alert("Failed to load categories");
    }
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!product.name || !product.price || !product.description || !product.categoryId) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await axiosInstance.post("/api/v1/products/add-product-details", product);
      alert("Product added successfully!");
      navigate("/addproduct"); // Go back to product management page
      if (res.status === 200) {
        setProduct("")
       }
    } 
    catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <HeadingMain h={'Add product'}/>

      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={product.name}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
      />

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={product.price}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={product.description}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
      />

      <select
        name="categoryId"
        value={product.categoryId}
        onChange={handleChange}
        className="w-full mb-6 p-2 border rounded"
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-red-800 hover:bg-red-700 text-white px-5 py-2 rounded"
        >
          Add Product
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
