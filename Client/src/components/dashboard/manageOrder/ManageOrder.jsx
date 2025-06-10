import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axiosInstance";
import {saveAs} from 'file-saver'

const ManageOrder = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    contactNum: "",
    paymentMethod: "Cash",
  });

  const [selected, setSelected] = useState({
    categoryId: "",
    productId: "",
    productName: "",
    price: "",
    quantity: 1,
  });

  const [orderList, setOrderList] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    setTotalAmount(
      orderList.reduce((acc, item) => acc + item.price * item.quantity, 0)
    );
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
    const filtered = products.filter((p) => p.categoryId === parseInt(categoryId));
    setFilteredProducts(filtered);
  };

  const handleProductChange = (productId) => {
    const product = filteredProducts.find((p) => p.id === parseInt(productId));
    if (product) {
      setSelected({
        ...selected,
        productId: product.id,
        productName: product.name,
        price: product.price,
      });
    }
  };

  const handleAddProduct = () => {
    if (!selected.productId || !selected.quantity) {
      alert("Please select product and quantity");
      return;
    }

    const exists = orderList.some((item) => item.productId === selected.productId);
    if (exists) {
      alert("Product already added!");
      return;
    }

    setOrderList([...orderList, selected]);
    setSelected({ ...selected, productId: "", price: "", productName: "", quantity: 1 });
  };

  const handleDelete = (productId) => {
    const updated = orderList.filter((item) => item.productId !== productId);
    setOrderList(updated);
  };

  // const handleSubmit = async () => {
  //   if (!customer.name || !customer.email || !customer.contactNum || !customer.paymentMethod) {
  //     alert("Please fill all customer fields.");
  //     return;
  //   }

  //   if (orderList.length === 0) {
  //     alert("Add at least one product to generate bill.");
  //     return;
  //   }

  //   const payload = {
  //     ...customer,
  //     totalAmount,
  //     productDetails: JSON.stringify(orderList),
  //   };

  //   try {
  //     const res = await axiosInstance.post("/api/v1/bills/generate-report", payload, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`, // if auth needed
  //       },
  //     });
  //     const uuid = res.data.data;
  //     window.open(`/api/v1/bills/get-pdf?uuid=${uuid}`, "_blank");
  //     console.log("UUID: " , uuid)
  //   } 
  //   catch (error) {
  //     alert("Error generating bill.", error);
  //   }
  // };

const handleGenerateBill = async () => {
  try {
    const payload = {
      name: customer.name,
      email: customer.email,
      contactNum: customer.contactNum,
      paymentMethod: customer.paymentMethod,
      totalAmount: totalAmount,
      productDetails: orderList,
    };
   
    console.log("Sending payload:", payload);

    // Step 1: Generate report
    const response = await axiosInstance.post("/api/v1/bills/generate-report", payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const uuid = response.data?.data;
    if (!uuid) {
      console.error("UUID not returned from backend.");
      return;
    }

    // Step 2: Download PDF
    const pdfResponse = await axiosInstance.get("/api/v1/bills/get-pdf", {
      params: { ...payload, uuid }, //  pass query parameters properly
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const pdfBlob = new Blob([pdfResponse.data], { type: "application/pdf" });
    saveAs(pdfBlob, `${uuid}.pdf`);
    console.log("PDF loaded")
    alert("PDF Downloaded successfully")
  } 

  catch (error) {
    console.log("Error generating/downloading PDF bill:", error);
    alert("Failed to generate or download bill. Please try again.");
  }
};


  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-3">Manage Order</h2>

      {/* Customer Details */}
      <div className="grid grid-cols-4 gap-4 bg-white p-4 rounded shadow mb-4">
        <input type="text" placeholder="Name" className="border p-2"
          value={customer.name}
          onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
        <input type="email" placeholder="Email" className="border p-2"
          value={customer.email}
          onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
        <input type="text" placeholder="Contact Number" className="border p-2"
          value={customer.contactNum}
          onChange={(e) => setCustomer({ ...customer, contactNum: e.target.value })} />
        <select className="border p-2"
          value={customer.paymentMethod}
          onChange={(e) => setCustomer({ ...customer, paymentMethod: e.target.value })}>
          <option>Cash</option>
          <option>Credit Card</option>
          <option>UPI</option>
        </select>
      </div>

      {/* Select Product */}
      <div className="grid grid-cols-6 gap-4 bg-white p-4 rounded shadow mb-4 items-center">
        <select className="border p-2"
          value={selected.categoryId}
          onChange={(e) => handleCategoryChange(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select className="border p-2"
          value={selected.productId}
          onChange={(e) => handleProductChange(e.target.value)}>
          <option value="">Select Product</option>
          {filteredProducts.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <input type="number" placeholder="Price" className="border p-2"
          value={selected.price}
          readOnly />

        <input type="number" placeholder="Quantity" className="border p-2"
          value={selected.quantity}
          onChange={(e) => setSelected({ ...selected, quantity: parseInt(e.target.value) })} />

        <div className="font-semibold">
          Total: {selected.price && selected.quantity ? selected.price * selected.quantity : 0}
        </div>

        <button className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={handleAddProduct}>Add</button>
      </div>

      {/* Product List */}
      {orderList.length > 0 && (
        <div className="bg-white p-4 rounded shadow">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-2">Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {orderList.map((item, idx) => {
                const category = categories.find(c => c.id === parseInt(item.categoryId));
                return (
                  <tr key={idx}>
                    <td className="p-2">{item.productName}</td>
                    <td>{category ? category.name : "-"}</td>
                    <td>{item.price}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price * item.quantity}</td>
                    <td>
                      <i className="text-red-700 fas fa-trash cursor-pointer" onClick={() => handleDelete(item.productId)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="mt-4 flex justify-end">
            <span className="font-bold mr-4">Total Amount: {totalAmount}</span>
            <button className="bg-red-800 text-white px-4 py-2 rounded" onClick={handleGenerateBill}>
              Submit & Get Bill
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrder;
