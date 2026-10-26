import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInstance";
import { saveAs } from "file-saver";
import HeadingMain from "../HeadingMain";

const ManageOrder = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [customer, setCustomer] = useState({
    name: "", email: "", contactNum: "", paymentMethod: "Cash",
  });
  const [selected, setSelected] = useState({
    categoryId: "", productId: "", productName: "", price: "", quantity: 1,
  });
  const [orderList, setOrderList] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => { fetchCategories(); fetchProducts(); }, []);

  useEffect(() => {
    setTotalAmount(orderList.reduce((acc, item) => acc + item.price * item.quantity, 0));
  }, [orderList]);

  const fetchCategories = async () => {
    const res = await axiosInstance.get("/api/v1/products/get-all-categories");
    setCategories(res.data.data);
  };

  const fetchProducts = async () => {
    const res = await axiosInstance.get("/api/v1/products/get-product-details");
    setProducts(res.data.data);
  };

  const handleCategoryChange = (categoryId) => {
    setSelected({ ...selected, categoryId, productId: "", price: "", productName: "" });
    setFilteredProducts(products.filter((p) => p.categoryId === parseInt(categoryId)));
  };

  const handleProductChange = (productId) => {
    const product = filteredProducts.find((p) => p.id === parseInt(productId));
    if (product) {
      setSelected({ ...selected, productId: product.id, productName: product.name, price: product.price });
    }
  };

  const handleAddProduct = () => {
    if (!selected.productId || !selected.quantity) { alert("Please select a product and quantity"); return; }
    if (orderList.some((item) => item.productId === selected.productId)) { alert("Product already added!"); return; }
    setOrderList([...orderList, selected]);
    setSelected({ ...selected, productId: "", price: "", productName: "", quantity: 1 });
  };

  const handleDelete = (productId) => {
    setOrderList(orderList.filter((item) => item.productId !== productId));
  };

  const handleGenerateBill = async () => {
    try {
      const payload = {
        name: customer.name,
        email: customer.email,
        contactNum: customer.contactNum,
        paymentMethod: customer.paymentMethod,
        totalAmount,
        productDetails: JSON.stringify(orderList),
      };
      const response = await axiosInstance.post("/api/v1/bills/generate-report", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const uuid = response.data?.data;
      if (!uuid) { console.error("UUID not returned"); return; }
      const pdfResponse = await axiosInstance.get("/api/v1/bills/get-pdf", {
        params: { uuid },
        responseType: "blob",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      saveAs(new Blob([pdfResponse.data], { type: "application/pdf" }), `${uuid}.pdf`);
      setCustomer({ name: "", email: "", contactNum: "", paymentMethod: "Cash" });
      setOrderList([]);
      setSelected({ categoryId: "", productId: "", productName: "", price: "", quantity: 1 });
      setFilteredProducts([]);
      alert("PDF downloaded successfully");
    } catch (error) {
      alert("Failed to generate bill. Please try again.");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <HeadingMain h="Manage Order" subtitle="Create a new order and generate a bill" />

      {/* Customer details */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">
          <i className="fa fa-user text-slate-400 mr-2"></i>Customer Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Name</label>
            <input type="text" placeholder="Customer name" className="dash-input" value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
            <input type="email" placeholder="customer@email.com" className="dash-input" value={customer.email}
              onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Contact</label>
            <input type="text" placeholder="+92 300 0000000" className="dash-input" value={customer.contactNum}
              onChange={(e) => setCustomer({ ...customer, contactNum: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Payment</label>
            <select className="dash-input" value={customer.paymentMethod}
              onChange={(e) => setCustomer({ ...customer, paymentMethod: e.target.value })}>
              <option>Cash</option>
              <option>Credit Card</option>
              <option>UPI</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product selection */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">
          <i className="fa fa-shopping-cart text-slate-400 mr-2"></i>Add Item
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
            <select className="dash-input" value={selected.categoryId} onChange={(e) => handleCategoryChange(e.target.value)}>
              <option value="">Select</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Product</label>
            <select className="dash-input" value={selected.productId} onChange={(e) => handleProductChange(e.target.value)}>
              <option value="">Select</option>
              {filteredProducts.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Price</label>
            <input type="number" className="dash-input bg-slate-50" value={selected.price} readOnly placeholder="Auto" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Quantity</label>
            <input type="number" className="dash-input" value={selected.quantity} min={1}
              onChange={(e) => setSelected({ ...selected, quantity: parseInt(e.target.value) })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Subtotal</label>
            <div className="dash-input bg-slate-50 font-semibold text-slate-700">
              PKR {selected.price && selected.quantity ? selected.price * selected.quantity : 0}
            </div>
          </div>
          <div>
            <button onClick={handleAddProduct} className="btn-primary w-full flex items-center justify-center gap-2">
              <i className="fa fa-plus text-xs"></i> Add
            </button>
          </div>
        </div>
      </div>

      {/* Order list */}
      {orderList.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">
              <i className="fa fa-list text-slate-400 mr-2"></i>Order Items
            </h3>
          </div>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th className="text-center">Remove</th>
              </tr>
            </thead>
            <tbody>
              {orderList.map((item, idx) => {
                const category = categories.find((c) => c.id === parseInt(item.categoryId));
                return (
                  <tr key={idx}>
                    <td className="font-medium text-slate-800">{item.productName}</td>
                    <td>
                      <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2 py-0.5 rounded-full">
                        {category ? category.name : "-"}
                      </span>
                    </td>
                    <td>PKR {item.price}</td>
                    <td>{item.quantity}</td>
                    <td className="font-semibold text-slate-800">PKR {item.price * item.quantity}</td>
                    <td className="text-center">
                      <button onClick={() => handleDelete(item.productId)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1">
                        <i className="fa fa-times"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">{orderList.length} item{orderList.length !== 1 ? "s" : ""}</p>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-slate-500">Total Amount</p>
                <p className="text-xl font-bold text-slate-800">PKR {totalAmount}</p>
              </div>
              <button onClick={handleGenerateBill} className="btn-primary flex items-center gap-2 px-6">
                <i className="fa fa-file-pdf-o"></i> Generate Bill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrder;
