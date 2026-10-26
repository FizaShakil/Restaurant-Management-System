import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInstance";
import { useNavigate } from "react-router-dom";
import HeadingMain from "../HeadingMain";

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({ name: "", price: "", description: "", categoryId: "" });
  const navigate = useNavigate();

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/products/get-all-categories");
      setCategories(res.data.data);
    } catch (error) {
      alert("Failed to load categories");
    }
  };

  const handleChange = (e) => setProduct({ ...product, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!product.name || !product.price || !product.description || !product.categoryId) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      await axiosInstance.post("/api/v1/products/add-product-details", product);
      alert("Product added successfully!");
      setProduct({ name: "", price: "", description: "", categoryId: "" });
      navigate("/manage-product");
    } catch (error) {
      alert("Failed to add product.");
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <HeadingMain h="Add Product" subtitle="Fill in the details to add a new product" />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Product Name</label>
          <input type="text" name="name" placeholder="e.g. Espresso" value={product.name} onChange={handleChange} className="dash-input" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Price (PKR)</label>
          <input type="number" name="price" placeholder="e.g. 250" value={product.price} onChange={handleChange} className="dash-input" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Description</label>
          <textarea
            name="description"
            placeholder="Brief product description..."
            value={product.description}
            onChange={handleChange}
            rows={3}
            className="dash-input resize-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Category</label>
          <select name="categoryId" value={product.categoryId} onChange={handleChange} className="dash-input">
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={handleSubmit} className="btn-primary flex-1">Add Product</button>
          <button onClick={() => navigate("/manage-product")} className="btn-secondary flex-1">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
