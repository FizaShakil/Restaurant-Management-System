import React from "react";
import HeadingMain from "../HeadingMain";

const Inventory = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <HeadingMain h="Inventory & Ingredients" subtitle="Monitor stock levels and manage ingredients" />
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 py-24 flex flex-col items-center justify-center text-slate-400">
        <i className="fa fa-cubes text-4xl mb-4"></i>
        <p className="text-sm font-medium">Inventory management coming soon</p>
      </div>
    </div>
  );
};

export default Inventory;
