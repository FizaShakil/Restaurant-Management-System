import React from "react";
import HeadingMain from "../HeadingMain";

const Customers = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <HeadingMain h="Customers" subtitle="View and manage your customer database" />
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 py-24 flex flex-col items-center justify-center text-slate-400">
        <i className="fa fa-address-book text-4xl mb-4"></i>
        <p className="text-sm font-medium">Customer management coming soon</p>
      </div>
    </div>
  );
};

export default Customers;
