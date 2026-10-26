import React from "react";
import HeadingMain from "../HeadingMain";

const Staff = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <HeadingMain h="Staff & Permissions" subtitle="Manage staff accounts and role-based permissions" />
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 py-24 flex flex-col items-center justify-center text-slate-400">
        <i className="fa fa-id-badge text-4xl mb-4"></i>
        <p className="text-sm font-medium">Staff & permissions coming soon</p>
      </div>
    </div>
  );
};

export default Staff;
