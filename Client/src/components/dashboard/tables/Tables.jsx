import React from "react";
import HeadingMain from "../HeadingMain";

const Tables = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <HeadingMain h="Tables & Reservations" subtitle="Manage dining tables and customer reservations" />
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 py-24 flex flex-col items-center justify-center text-slate-400">
        <i className="fa fa-table text-4xl mb-4"></i>
        <p className="text-sm font-medium">Tables & reservations coming soon</p>
      </div>
    </div>
  );
};

export default Tables;
