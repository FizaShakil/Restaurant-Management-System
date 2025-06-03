// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import ProductTable from "./ProductTable";
// import ProductFormModal from "./ProductFormModal";
// import { toast } from "react-toastify";

// const ManageProduct = () => {
//   const [products, setProducts] = useState([]);
//   const [editProduct, setEditProduct] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);

//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get("/api/v1/products/get-product-details");
//       setProducts(res.data);
//       console.log(res.data)
//     } 
//     catch (error) {
//       console.log("Error fetching products", error)
//       toast.error("Failed to load products.");
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const handleEditClick = (product) => {
//     setEditProduct(product);
//     setModalOpen(true);
//   };

//   const handleDelete = async (id) => {
//     if (confirm("Delete this product?")) {
//       try {
//         await axios.delete(`/api/v1/products/delete-product/${id}`);
//         toast.success("Product deleted!");
//         fetchProducts();
//       } 
//       catch (error) {
//         toast.error("Failed to delete.");
//       }
//     }
//   };

//   const handleStatusToggle = async (id, status) => {
//     try {
//       await axios.patch("/api/v1/products/update-status", {
//         id,
//         status: status ? "false" : "true",
//       });
//       fetchProducts();
//     } catch (error) {
//       toast.error("Status update failed.");
//     }
//   };

//   return (
//     <div className="p-5 w-full">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-xl font-bold text-red-900">Manage Product</h1>
//         <button
//           onClick={() => { setModalOpen(true); setEditProduct(null); }}
//           className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//         >
//           Add Product
//         </button>
//       </div>

//       <ProductTable
//         products={products}
//         onEdit={handleEditClick}
//         onDelete={handleDelete}
//         onStatusToggle={handleStatusToggle}
//       />

//       {modalOpen && (
//         <ProductFormModal
//           product={editProduct}
//           onClose={() => setModalOpen(false)}
//           onRefresh={fetchProducts}
//         />
//       )}
//     </div>
//   );
// };

// export default ManageProduct;

import { useEffect, useState } from "react";
import axiosInstance from '../../../axiosInstance'
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
      console.log(res.data.data)
    } 
    catch (err) {
      console.log("Error fetching products:", err);
    }
  };

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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete("/api/v1/products/delete-product-details", {
        data: { id },
      });
      setProducts((prev) =>
        prev.filter((product) => product.productUniqueID !== productUniqueID)
      );
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const handleToggleStatus = async (product) => {
    try {
      // const updatedStatus = !product.status;
      const updatedStatus = {
           id: product.id,
           status: product.status === "true" || product.status === true ? "false" : "true",
        };

      // const updatedProduct = { ...product, status: updatedStatus };
      await axiosInstance.patch("/api/v1/products/update-status", updatedStatus);
         setProducts((prev) =>
         prev.map((item) =>
         item.id === product.id
          ? { ...item, status: updatedStatus.status }
          : item
         )
       );
    } 
    catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.patch("/api/v1/products/update-product-details", selectedProduct);
      setProducts((prev) =>
        prev.map((item) =>
          item.id === selectedProduct.id ? selectedProduct : item
        )
      );
      setEditModalOpen(false);
      alert("Updated product successfully")
    } 
    catch (err) {
      console.log("Failed to update product:", err);
    }
  };

  return (
    <div className="p-6 w-full">
      <HeadingMain h={'Manage Product'}/>
           <button
          className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          <Link to='/addproduct'>Add Product</Link>
        </button>
      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              {/* <th className="p-3 border">Image</th> */}
              <th className="p-3 border">Name</th>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Category</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {/* <td className="p-2 border">
                    <img
                      src={item.productImage}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded"
                    />
                  </td> */}
                  <td className="p-2 border">{item.name}</td>
                  <td className="p-2 border">{item.id}</td>
                  <td className="p-2 border">{item.categoryName}</td>
                  <td className="p-2 border">PKR {item.price}</td>
                  <td className="p-2 border text-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={item.status === "true"}
                        onChange={() => handleToggleStatus(item)}
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 relative after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </td>
                  <td className="p-2 border text-center space-x-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="text-blue-500 hover:text-blue-700 fas fa-pen"
                      title="Edit"
                    ></button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:text-red-700 fas fa-trash"
                      title="Delete"
                    ></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Product</h3>
            <form onSubmit={handleEditSubmit} className="space-y-3">
              <input
                type="text"
                name="name"
                value={selectedProduct.name}
                onChange={handleEditChange}
                placeholder="Product Name"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="description"
                value={selectedProduct.description}
                onChange={handleEditChange}
                placeholder="Description"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="price"
                value={selectedProduct.price}
                onChange={handleEditChange}
                placeholder="Price"
                className="w-full p-2 border rounded"
              />
            <select
               name="categoryId"
               value={selectedProduct.categoryId}
               onChange={handleEditChange}
               className="w-full mb-6 p-2 border rounded"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                 <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
               ))}
             </select>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProduct;
