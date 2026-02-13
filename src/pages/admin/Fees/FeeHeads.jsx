import React, { useEffect, useState } from "react";
import api from "../../../apis/axios";

const FeeHeads = () => {
  const [feeHeads, setFeeHeads] = useState([]);
  const [form, setForm] = useState({ name: "", code: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchFeeHeads = async () => {
    setLoading(true);
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
    } catch {
      alert("Failed to create fee head");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/80 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* ----- HEADER with decorative accent (icon removed) ----- */}
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#0b1f3a]/5 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="relative">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0b1f3a]">
              Fee Heads
            </h1>
            <p className="text-gray-500 mt-1.5 text-base max-w-2xl">
              Organise and manage all billing categories – create new fee heads, view existing
              ones, and track their status.
            </p>
          </div>
        </div>

        {/* ----- CREATE FORM – modern card with corrected layout ----- */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200/90 p-6 sm:p-8 transition-all hover:shadow-lg">
          <div className="flex items-center gap-2 pb-5 border-b border-gray-200 mb-6">
            <div className="w-1 h-6 bg-[#0b1f3a] rounded-full" />
            <h2 className="text-xl font-semibold text-[#0b1f3a]">Create New Fee Head</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Two-column for Name and Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Fee Head Name"
                placeholder="e.g. Tuition Fee"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                icon={
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                }
              />
              <Input
                label="Code"
                placeholder="e.g. TUIT"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                icon={
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                    />
                  </svg>
                }
              />
            </div>

            {/* Full-width Description */}
            <Textarea
              label="Description"
              placeholder="Optional details about this fee head..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            {/* Button row – right aligned */}
            <div className="flex justify-end">
             <button
  type="submit"
  disabled={submitting || !form.name}
  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5
             bg-[#001f3f] hover:bg-[#001933] active:bg-[#001326]
             text-white text-sm font-semibold rounded-xl
             shadow-lg hover:shadow-xl active:shadow-md
             transition-all duration-200 ease-out
             hover:scale-[1.02] active:scale-[0.98]
             disabled:cursor-not-allowed disabled:bg-[#001f3f]
             focus:outline-none focus:ring-2 focus:ring-[#001f3f] focus:ring-offset-2"
>


                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4.5 h-4.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Fee Head
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ----- EXISTING FEE HEADS – table with modern clean style ----- */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200/90 p-6 sm:p-8 transition-all hover:shadow-lg">
          <div className="flex items-center justify-between pb-5 border-b border-gray-200 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-[#0b1f3a] rounded-full" />
              <h2 className="text-xl font-semibold text-[#0b1f3a]">Existing Fee Heads</h2>
            </div>
            {!loading && feeHeads.length > 0 && (
              <span className="bg-[#0b1f3a]/10 text-[#0b1f3a] text-xs font-medium px-3 py-1.5 rounded-full">
                {feeHeads.length} total
              </span>
            )}
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-[#0b1f3a] border-t-transparent rounded-full animate-spin" />
                        <span className="text-gray-400 text-sm">Loading fee heads...</span>
                      </div>
                    </td>
                  </tr>
                ) : feeHeads.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          className="w-10 h-10 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                          />
                        </svg>
                        <span className="text-gray-400 text-sm">No fee heads created yet</span>
                        <span className="text-gray-300 text-xs">
                          Create your first fee head using the form above
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  feeHeads.map((head, idx) => (
                    <tr
                      key={head._id || idx}
                      className="group hover:bg-[#0b1f3a]/[0.02] transition-colors duration-150"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-[#0b1f3a]/40 rounded-full group-hover:bg-[#0b1f3a] transition-colors" />
                          {head.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                        {head.code ? (
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded-md">
                            {head.code}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                        {head.description || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                            head.isActive
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              head.isActive ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          />
                          {head.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

       
      </div>
    </div>
  );
};

/* ---------- Enhanced form elements with icons and better spacing ---------- */
const Input = ({ label, icon, ...props }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-gray-700">
      {label} {props.required && <span className="text-[#0b1f3a] ml-0.5">*</span>}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        {...props}
        className={`w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl
                   focus:outline-none focus:ring-2 focus:ring-[#0b1f3a]/20 focus:border-[#0b1f3a]
                   placeholder:text-gray-400 text-gray-700
                   transition-all duration-200
                   ${icon ? "pl-10" : "pl-4"}`}
      />
    </div>
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="space-y-1.5">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <textarea
      {...props}
      rows="3"
      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl
                 focus:outline-none focus:ring-2 focus:ring-[#0b1f3a]/20 focus:border-[#0b1f3a]
                 placeholder:text-gray-400 text-gray-700
                 transition-all duration-200 resize-y"
    />
  </div>
);

export default FeeHeads;