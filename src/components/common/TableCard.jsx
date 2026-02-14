import React from "react";

const TableCard = ({ title, extra, children }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
      
      {/* Header Section */}
      <div className="flex items-center justify-between pb-4 border-b mb-6">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-[#001f3f] rounded-full" />
          <h2 className="text-lg font-semibold text-[#001f3f]">
            {title}
          </h2>
        </div>

        {extra && <div>{extra}</div>}
      </div>

      {/* Content Section */}
      {children}
    </div>
  );
};

export default TableCard;
