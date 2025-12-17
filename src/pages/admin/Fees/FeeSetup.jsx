import React, { useState } from "react";
import FeeHeads from "./FeeHeads";
import FeeRules from "./FeeRules";

const FeeSetup = () => {
  const [activeTab, setActiveTab] = useState("heads");

  const tabStyle = (tab) => ({
    padding: "10px 20px",
    cursor: "pointer",
    borderBottom: activeTab === tab ? "3px solid navy" : "3px solid transparent",
    color: activeTab === tab ? "navy" : "#555",
    fontWeight: activeTab === tab ? "600" : "400",
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "navy" }}>Fee Setup</h2>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={tabStyle("heads")} onClick={() => setActiveTab("heads")}>
          Fee Heads
        </div>
        <div style={tabStyle("rules")} onClick={() => setActiveTab("rules")}>
          Fee Structure
        </div>
      </div>

      <div style={{ marginTop: "30px" }}>
        {activeTab === "heads" && <FeeHeads />}
        {activeTab === "rules" && <FeeRules />}
      </div>
    </div>
  );
};

export default FeeSetup;
