import React, { useEffect, useState } from "react";
import api from "../../../apis/axios";

const FeeStructure = () => {
  const [classes, setClasses] = useState([]);
  const [feeHeads, setFeeHeads] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [session, setSession] = useState("2024-25");
  const [amounts, setAmounts] = useState({});
  const [loading, setLoading] = useState(false);

  // Load classes
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const schoolId = localStorage.getItem("schoolId");
        const res = await api.get("/api/classes", { params: { schoolId } });
        setClasses(res.data?.data || res.data || []);
      } catch (err) {
        console.error("Failed to load classes", err);
      }
    };
    loadClasses();
  }, []);

  // Load fee heads
  useEffect(() => {
    const loadFeeHeads = async () => {
      try {
        const res = await api.get("/api/fees/heads");
        setFeeHeads(res.data?.data || res.data || []);
      } catch (err) {
        console.error("Failed to load fee heads", err);
      }
    };
    loadFeeHeads();
  }, []);

  // Load existing fee structure for selected class + session
  useEffect(() => {
    if (!selectedClass) return;

    const loadStructure = async () => {
      try {
        setLoading(true);

        const res = await api.get("/api/fees/structure", {
          params: { classId: selectedClass, session }
        });

        const structure = res.data?.data;
        const obj = {};

        structure?.items?.forEach((item) => {
          if (item?.feeHeadId?._id) {
            obj[item.feeHeadId._id] = item.amount;
          }
        });

        setAmounts(obj);
      } catch (err) {
        console.error("Failed to load fee structure", err);
      } finally {
        setLoading(false);
      }
    };

    loadStructure();
  }, [selectedClass, session]);

  const handleSave = async () => {
    try {
      const schoolId = localStorage.getItem("schoolId");

      const items = Object.entries(amounts).map(([feeHeadId, amount]) => ({
        feeHeadId,
        amount: Number(amount)
      }));

      await api.post("/api/fees/structure", {
        schoolId,
        classId: selectedClass,
        session,
        items
      });

      alert("Fee structure saved successfully");
    } catch (err) {
      console.error("Failed to save fee structure", err);
      alert("Error saving fee structure");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-[#0a1a44]">
        Fee Structure Setup
      </h2>

      {/* Class + Session */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <select
          className="border p-2 rounded"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select Class</option>
          {classes?.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} {c.section ? `- ${c.section}` : ""}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={session}
          onChange={(e) => setSession(e.target.value)}
        >
          <option value="2024-25">2024-25</option>
          <option value="2025-26">2025-26</option>
        </select>
      </div>

      {loading && (
        <p className="text-gray-500 mb-4">Loading fee structure...</p>
      )}

      {/* Fee Heads with amounts */}
      <div className="space-y-4">
        {feeHeads?.length === 0 && (
          <p className="text-gray-500">No fee heads found. Add some first.</p>
        )}

        {feeHeads?.map((head) => (
          <div
            key={head._id}
            className="flex justify-between items-center border p-3 rounded bg-gray-50"
          >
            <span className="font-medium">{head.name}</span>
            <input
              type="number"
              className="border p-2 rounded w-32"
              value={amounts[head._id] || ""}
              onChange={(e) =>
                setAmounts({ ...amounts, [head._id]: e.target.value })
              }
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        className="mt-6 bg-[#0a1a44] text-white px-6 py-2 rounded-lg"
        disabled={!selectedClass}
      >
        Save Fee Structure
      </button>
    </div>
  );
};

export default FeeStructure;
