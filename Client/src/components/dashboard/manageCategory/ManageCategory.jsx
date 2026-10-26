import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInstance";
import { toast } from "react-toastify";
import HeadingMain from "../HeadingMain";

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [categoryId, setCategoryId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/categories/get-category-details");
      setCategories(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleOpen = (category = null) => {
    if (category) {
      setEditMode(true);
      setName(category.name);
      setCategoryId(category.id);
    } else {
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

  const handleSubmit = async () => {
    if (!name.trim()) { toast.warning("Category name is required"); return; }
    try {
      if (editMode) {
        await axiosInstance.patch("/api/v1/categories/update-category-details", { id: categoryId, name });
        toast.success("Category updated");
      } else {
        await axiosInstance.post("/api/v1/categories/add-category-details", { name });
        toast.success("Category added");
      }
      fetchCategories();
      handleClose();
    } catch (error) {
      toast.error("Error saving category");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <HeadingMain h="Manage Categories" subtitle="Add and edit your product categories" />
        <button className="btn-primary flex items-center gap-2" onClick={() => handleOpen()}>
          <i className="fa fa-plus text-xs"></i>
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {categories.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <i className="fa fa-tags text-3xl mb-3 block"></i>
            <p className="text-sm">No categories yet. Add one to get started.</p>
          </div>
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Category Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, idx) => (
                <tr key={cat.id}>
                  <td className="text-slate-400 font-mono text-xs w-12">{idx + 1}</td>
                  <td className="font-medium text-slate-800">{cat.name}</td>
                  <td className="w-20">
                    <button
                      onClick={() => handleOpen(cat)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      <i className="fa fa-pencil"></i>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-slate-800">
                {editMode ? "Edit Category" : "New Category"}
              </h3>
              <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <i className="fa fa-times text-lg"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Beverages"
                  className="dash-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  autoFocus
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={handleSubmit} className="btn-primary flex-1">
                  {editMode ? "Update Category" : "Add Category"}
                </button>
                <button onClick={handleClose} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategory;
