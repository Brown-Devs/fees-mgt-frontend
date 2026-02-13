import React, { useEffect, useState } from "react";
import api from "../../../apis/axios";

const FeeStructure = () => {
  const [classes, setClasses] = useState([]);
  const [feeHeads, setFeeHeads] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [session, setSession] = useState("2024-25");
  const [amounts, setAmounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const schoolId = localStorage.getItem("schoolId");
        const res = await api.get("/api/classes", { params: { schoolId } });
        setClasses(res.data?.data || res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadClasses();
  }, []);

  useEffect(() => {
    const loadFeeHeads = async () => {
      try {
        const res = await api.get("/api/fees/heads");
        setFeeHeads(res.data?.data || res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadFeeHeads();
  }, []);

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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStructure();
  }, [selectedClass, session]);

  const handleSave = async () => {
    try {
      setSaving(true);
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
      alert("Error saving fee structure");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/80 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-[#001f3f]">
            Fee Structure Setup
          </h1>
          <p className="text-gray-500 mt-1">
            Configure fee amounts class-wise for each academic session.
          </p>
        </div>

        {/* Selection Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center gap-2 pb-4 border-b mb-6">
            <div className="w-1 h-6 bg-[#001f3f] rounded-full" />
            <h2 className="text-lg font-semibold text-[#001f3f]">
              Select Class & Session
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl
                         focus:ring-2 focus:ring-[#001f3f]/20 focus:border-[#001f3f]"
            >
              <option value="">Select Class</option>
              {classes?.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} {c.section ? `- ${c.section}` : ""}
                </option>
              ))}
            </select>

            <select
              value={session}
              onChange={(e) => setSession(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl
                         focus:ring-2 focus:ring-[#001f3f]/20 focus:border-[#001f3f]"
            >
              <option value="2024-25">2024-25</option>
              <option value="2025-26">2025-26</option>
            </select>
          </div>
        </div>

        {/* Fee Heads Table */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
          <div className="flex items-center gap-2 pb-4 border-b mb-6">
            <div className="w-1 h-6 bg-[#001f3f] rounded-full" />
            <h2 className="text-lg font-semibold text-[#001f3f]">
              Assign Amounts
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading fee structure...
            </div>
          ) : feeHeads.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No fee heads found. Please create fee heads first.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Fee Head
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Amount (₹)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {feeHeads.map((head) => (
                    <tr key={head._id} className="hover:bg-[#001f3f]/[0.02]">
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {head.name}
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          placeholder="Enter amount"
                          value={amounts[head._id] || ""}
                          onChange={(e) =>
                            setAmounts({
                              ...amounts,
                              [head._id]: e.target.value
                            })
                          }
                          className="w-40 px-3 py-2 border border-gray-300 rounded-lg
                                     focus:ring-2 focus:ring-[#001f3f]/20 focus:border-[#001f3f]"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
  onClick={handleSave}
  disabled={!selectedClass || saving}
  className="px-7 py-3
             bg-[#001f3f] hover:bg-[#001933] active:bg-[#001326]
             text-white font-semibold rounded-xl
             shadow-md hover:shadow-lg
             transition-all duration-200
             disabled:bg-[#001f3f] disabled:cursor-not-allowed disabled:opacity-80
             focus:outline-none focus:ring-2 focus:ring-[#001f3f] focus:ring-offset-2"
>
  {saving ? "Saving..." : "Save Fee Structure"}
</button>


          </div>
        </div>

      </div>
    </div>
  );
};

export default FeeStructure;
