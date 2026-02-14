import React, { useEffect, useState } from "react";
import {
  fetchEnquiries,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry
} from "../../../services/enquiryService";
import EnquiryFormModal from "./EnquiryFormModal";
import PageHeader from "../../../components/common/PageHeader";
import TableCard from "../../../components/common/TableCard";

export default function EnquiryList() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20 });
  const [filters, setFilters] = useState({
    search: "",
    source: "",
    status: "",
    startDate: "",
    endDate: ""
  });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetchEnquiries({
        ...filters,
        page,
        limit: meta.limit
      });
      setData(res.data.data || []);
      setMeta(res.data.meta || { total: 0, page, limit: meta.limit });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, []);

  const handleSave = async (payload) => {
    if (editing) await updateEnquiry(editing._id, payload);
    else await createEnquiry(payload);
    setModalOpen(false);
    setEditing(null);
    load(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this enquiry?")) return;
    await deleteEnquiry(id);
    load(meta.page);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/80 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <PageHeader
            title="Admission Enquiries"
            subtitle="Manage and follow up admission enquiries."
            buttonText="+ Add Enquiry"
            onButtonClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            <span className="bg-[#001f3f]/10 text-[#001f3f] text-xs font-medium px-3 py-1.5 rounded-full">
              {meta.total} Total
            </span>
          </PageHeader>

          <TableCard title="Enquiry Records">

            {/* Filters */}
            <div className="grid md:grid-cols-6 gap-4 mb-6">
              <input
                placeholder="Search name, phone, email"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-xl"
              />

              <select
                value={filters.source}
                onChange={(e) =>
                  setFilters({ ...filters, source: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-xl"
              >
                <option value="">All Sources</option>
                <option>Website</option>
                <option>Facebook</option>
                <option>YouTube</option>
                <option>Admin</option>
              </select>

              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-xl"
              >
                <option value="">All Status</option>
                <option>Active</option>
                <option>No Action</option>
                <option>Done</option>
              </select>

              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-xl"
              />

              <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-3 mb-6">
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
                    source: "",
                    status: "",
                    startDate: "",
                    endDate: ""
                  });
                  load(1);
                }}
                className="px-4 py-2 bg-gray-200 rounded-xl hover:bg-gray-300"
              >
                Reset
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">#</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Source</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Enquiry Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Follow Up</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Mobile</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-10 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-10 text-center text-gray-400">
                        No enquiries found.
                      </td>
                    </tr>
                  ) : (
                    data.map((r, idx) => (
                      <tr key={r._id} className="hover:bg-[#001f3f]/[0.02]">
                        <td className="px-6 py-4">
                          {(meta.page - 1) * meta.limit + idx + 1}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              r.status === "Active"
                                ? "bg-blue-50 text-blue-700"
                                : r.status === "Done"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {r.source}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {r.enquiryDate &&
                            new Date(r.enquiryDate).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {r.followUpDate &&
                            new Date(r.followUpDate).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4 font-medium text-gray-800">
                          {r.name}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {r.phone}
                        </td>

                        <td className="px-6 py-4 text-center space-x-3">
                          <button
                            onClick={() => {
                              setEditing(r);
                              setModalOpen(true);
                            }}
                            className="text-[#001f3f] font-medium hover:underline"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(r._id)}
                            className="text-rose-600 font-medium hover:underline"
                          >
                            Delete
                          </button>
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

      <EnquiryFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
        initial={editing}
      />
    </>
  );
}
