import React from "react";
import HeadingMain from "../HeadingMain";

const KitchenDisplay = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <HeadingMain h="Kitchen Display" subtitle="Live view of pending and in-progress kitchen orders" />
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 py-24 flex flex-col items-center justify-center text-slate-400">
        <i className="fa fa-fire text-4xl mb-4"></i>
        <p className="text-sm font-medium">Kitchen display coming soon</p>
      </div>
    </div>
  );
};

export default KitchenDisplay;
