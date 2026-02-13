import React, { useState } from "react";
import FeeHeads from "./FeeHeads";
import FeeStructure from "./FeeStructure";
import TransportManagementPage from "./TransportManagementPage";

const FeeSetup = () => {
  const [activeTab, setActiveTab] = useState("heads");

  const tabs = [
    { id: "heads", label: "Fee Heads" },
    { id: "structure", label: "Fee Structure" },
    { id: "transport", label: "Transport Fee" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Fees Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Configure fee heads, structures and transport charges
          </p>
        </div>

        
      </div>

      {/* Premium Card Wrapper */}
      <div className="bg-white rounded-2xl
                      shadow-[0_14px_36px_rgba(0,0,0,0.08)]
                      border border-slate-200 overflow-hidden">

        {/* Accent bar */}
        <div className="h-1 bg-gradient-to-r from-[#0b1f3a] to-[#162e52]" />

        {/* Tabs */}
        <div className="px-6 pt-6">
          <div className="flex gap-8 border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-medium transition
                  ${
                    activeTab === tab.id
                      ? "text-[#0b1f3a] border-b-2 border-[#0b1f3a]"
                      : "text-slate-500 hover:text-[#0b1f3a]"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "heads" && <FeeHeads />}
          {activeTab === "structure" && <FeeStructure />}
          {activeTab === "transport" && <TransportManagementPage />}
        </div>
      </div>
    </div>
  );
};

export default FeeSetup;
