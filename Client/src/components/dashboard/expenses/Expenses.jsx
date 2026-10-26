import React from "react";
import HeadingMain from "../HeadingMain";

const Expenses = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <HeadingMain h="Expenses & Profit" subtitle="Track business expenses and view profit summaries" />
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 py-24 flex flex-col items-center justify-center text-slate-400">
        <i className="fa fa-line-chart text-4xl mb-4"></i>
        <p className="text-sm font-medium">Expenses & profit tracking coming soon</p>
      </div>
    </div>
  );
};

export default Expenses;
