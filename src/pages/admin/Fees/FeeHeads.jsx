import React, { useEffect, useState } from "react";
import api from "../../../apis/axios";
import PageHeader from "../../../components/common/PageHeader";
import TableCard from "../../../components/common/TableCard";

const FeeHeads = () => {
  const [feeHeads, setFeeHeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
  });

  const fetchFeeHeads = async () => {
    try {
      const res = await api.get("/api/fees/heads");
      setFeeHeads(res.data?.data || res.data || []);
    } catch {
      alert("Failed to load fee heads");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeeHeads();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post("/api/fees/heads", form);
      const newHead = res.data?.data || res.data;
      setFeeHeads((prev) => [...prev, newHead]);
      setForm({ name: "", code: "", description: "" });
      setShowModal(false);
    } catch {
      alert("Failed to create fee head");
    }
    setSubmitting(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/80 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <PageHeader
            title="Fee Heads"
            subtitle="Manage billing categories and fee structures."
            buttonText="+ Add Fee Head"
            onButtonClick={() => setShowModal(true)}
          />

          {/* Table */}
          <TableCard title="Fee Head List">
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : feeHeads.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-10 text-center text-gray-400">
                        No fee heads found
                      </td>
                    </tr>
                  ) : (
                    feeHeads.map((head) => (
                      <tr key={head._id} className="hover:bg-[#001f3f]/[0.02]">
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {head.name}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {head.code || "-"}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {head.description || "-"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              head.isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-rose-50 text-rose-700"
                            }`}
                          >
                            {head.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TableCard>

        </div>
      </div>

      {/* ================= ADD MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6 space-y-4">
            <h3 className="text-xl font-semibold text-[#001f3f]">
              Add Fee Head
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Fee Head Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Code"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value })
                }
              />

              <textarea
                placeholder="Description"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#001f3f] text-white rounded-xl hover:bg-[#001933]"
                >
                  {submitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FeeHeads;
