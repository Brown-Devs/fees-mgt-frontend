import React, { useEffect, useState } from "react";
import api from "../../../apis/axios";
import ComplaintForm from "./ComplaintForm";
import PageHeader from "../../../components/common/PageHeader";
import TableCard from "../../../components/common/TableCard";

export default function ComplaintList() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20 });
  const [filters, setFilters] = useState({
    search: "",
    complaintType: "",
    complaintStatus: ""
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/api/complaints", {
        params: { ...filters, page, limit: meta.limit }
      });
      setData(res.data.data || []);
      setMeta(res.data.meta || { total: 0, page, limit: meta.limit });
    } catch (err) {
      console.error("Failed to load complaints", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/80 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <PageHeader
            title="Complaints"
            subtitle="Manage and track complaints efficiently."
            buttonText="+ Add Complaint"
            onButtonClick={() => setShowForm(true)}
          >
            <span className="bg-[#001f3f]/10 text-[#001f3f] text-xs font-medium px-3 py-1.5 rounded-full">
              {meta.total} Total
            </span>
          </PageHeader>

          {/* Complaint Form Modal */}
          {showForm && (
            <ComplaintForm
              onSaved={() => {
                setShowForm(false);
                load(1);
              }}
              onClose={() => setShowForm(false)}
            />
          )}

          <TableCard title="Complaint Records">

            {/* Filters */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <input
                placeholder="Search title, phone"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-xl"
              />

              <select
                value={filters.complaintType}
                onChange={(e) =>
                  setFilters({ ...filters, complaintType: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-xl"
              >
                <option value="">All Types</option>
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
                <option value="Transport">Transport</option>
                <option value="Other">Other</option>
              </select>

              <select
                value={filters.complaintStatus}
                onChange={(e) =>
                  setFilters({ ...filters, complaintStatus: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-xl"
              >
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              <div className="flex gap-3">
                <button
                  onClick={() => load(1)}
                  className="px-4 py-2 bg-[#001f3f] text-white rounded-xl hover:bg-[#001933]"
                >
                  Apply
                </button>

                <button
                  onClick={() => {
                    setFilters({
                      search: "",
                      complaintType: "",
                      complaintStatus: ""
                    });
                    load(1);
                  }}
                  className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">#</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Against</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Phone</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-10 text-center text-gray-400">
                        No complaints found.
                      </td>
                    </tr>
                  ) : (
                    data.map((r, idx) => (
                      <tr key={r._id} className="hover:bg-[#001f3f]/[0.02]">
                        <td className="px-6 py-4">
                          {(meta.page - 1) * meta.limit + idx + 1}
                        </td>

                        <td className="px-6 py-4 font-medium text-gray-800">
                          {r.title}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          <div className="font-medium">{r.complaintType}</div>
                          {r.targetName && (
                            <div className="text-xs text-gray-500">
                              {r.targetName}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              r.complaintStatus === "Resolved"
                                ? "bg-emerald-50 text-emerald-700"
                                : r.complaintStatus === "In Progress"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {r.complaintStatus || "Pending"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {r.phone || "-"}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {r.date && new Date(r.date).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                          {r.description}
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
    </>
  );
}
