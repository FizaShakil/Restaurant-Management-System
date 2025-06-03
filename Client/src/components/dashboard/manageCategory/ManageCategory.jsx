import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInstance";
import { toast } from "react-toastify";

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [categoryId, setCategoryId] = useState(null);

  // Fetch categories on load
  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/categories/get-category-details");
      setCategories(res.data.data);
    } 
    catch (error) {
      console.log("Error in fetching categories", error)
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Open modal for Add or Edit
  const handleOpen = (category = null) => {
    if (category) {
      setEditMode(true);
      setName(category.name);
      setCategoryId(category.id);
    } 
    else {
      setEditMode(false);
      setName("");
      setCategoryId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName("");
    setEditMode(false);
    setCategoryId(null);
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.warning("Category name is required");
      return;
    }

    try {
      if (editMode) {
        // Update category
        await axiosInstance.patch("/api/v1/categories/update-category-details", {
          id: categoryId,
          name,
        });
        toast.success("Category updated");
      } 
      else {
        // Add category
        await axiosInstance.post("/api/v1/categories/add-category-details", {
          name,
        });
        toast.success("Category added");
      }
      fetchCategories();
      handleClose();
    } 
    catch (error) {
      console.log("Error", err)
      toast.error("Error saving category");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Manage Category</h2>
        <button
          className="bg-red-800 text-white px-4 py-2 rounded"
          onClick={() => handleOpen()}
        >
          Add Category
        </button>
      </div>

      {/* Category Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} className="border-t">
              <td className="p-2">{cat.name}</td>
              <td className="p-2">
                <i className="fas fa-edit" 
                onClick={() => handleOpen(cat)}></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {open && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              {editMode ? "Edit Category" : "Add Category"}
            </h3>
            <input
              type="text"
              placeholder="Category name"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                {editMode ? "Update" : "Add"}
              </button>
              <button
                onClick={handleClose}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategory;


{/* <HeadingMain h={"Manage Category"}/>
                 <button
                className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                <Link to='/addcategory'>Add Category</Link> */}