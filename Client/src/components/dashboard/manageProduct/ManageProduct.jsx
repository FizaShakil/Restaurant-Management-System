import { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInstance";
import HeadingMain from "../HeadingMain";
import { Link } from "react-router-dom";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/products/get-product-details");
      setProducts(res.data.data);
    } catch (err) {
      console.log("Error fetching products:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/products/get-all-categories");
      setCategories(res.data.data);
    } catch (error) {
      alert("Failed to load categories");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axiosInstance.delete("/api/v1/products/delete-product-details", { data: { id } });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      const updatedStatus = {
        id: product.id,
        status: product.status === "true" || product.status === true ? "false" : "true",
      };
      await axiosInstance.patch("/api/v1/products/update-status", updatedStatus);
      setProducts((prev) =>
        prev.map((item) => (item.id === product.id ? { ...item, status: updatedStatus.status } : item))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const openEditModal = (product) => { setSelectedProduct(product); setEditModalOpen(true); };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.patch("/api/v1/products/update-product-details", selectedProduct);
      setProducts((prev) => prev.map((item) => (item.id === selectedProduct.id ? selectedProduct : item)));
      setEditModalOpen(false);
      alert("Product updated successfully");
    } catch (err) {
      console.log("Failed to update product:", err);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <HeadingMain h="Manage Products" subtitle="View, edit and manage your product catalog" />
        <Link to="/addproduct" className="btn-primary flex items-center gap-2">
          <i className="fa fa-plus text-xs"></i>
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          {products.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <i className="fa fa-box text-3xl mb-3 block"></i>
              <p className="text-sm">No products found.</p>
            </div>
          ) : (
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>ID</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item.id}>
                    <td className="font-medium text-slate-800">{item.name}</td>
                    <td className="text-slate-400 font-mono text-xs">{item.id}</td>
                    <td>
                      <span className="inline-block bg-slate-100 text-slate-600 text-xs font-medium px-2 py-0.5 rounded-full">
                        {item.categoryName}
                      </span>
                    </td>
                    <td className="font-medium">PKR {item.price}</td>
                    <td className="text-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={item.status === "true"}
                          onChange={() => handleToggleStatus(item)}
                        />
                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:bg-emerald-500 relative after:content-[''] after:absolute after:top-0.5 after:left-[3px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                      </label>
                    </td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <i className="fa fa-pencil"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Delete"
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && selectedProduct && (
        <div className="modal-overlay" onClick={() => setEditModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-slate-800">Edit Product</h3>
              <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fa fa-times text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Product Name</label>
                <input type="text" name="name" value={selectedProduct.name} onChange={handleEditChange} placeholder="Product Name" className="dash-input" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Description</label>
                <input type="text" name="description" value={selectedProduct.description} onChange={handleEditChange} placeholder="Description" className="dash-input" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Price (PKR)</label>
                <input type="text" name="price" value={selectedProduct.price} onChange={handleEditChange} placeholder="Price" className="dash-input" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Category</label>
                <select name="categoryId" value={selectedProduct.categoryId} onChange={handleEditChange} className="dash-input">
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">Update Product</button>
                <button type="button" onClick={() => setEditModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProduct;
