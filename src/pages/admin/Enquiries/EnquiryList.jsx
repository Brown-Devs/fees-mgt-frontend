import React, { useEffect, useState } from "react";
import {
  fetchEnquiries,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry
} from "../../../services/enquiryService";
import EnquiryFormModal from "./EnquiryFormModal";

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
    if (editing) {
      await updateEnquiry(editing._id, payload);
    } else {
      await createEnquiry(payload);
    }
    setModalOpen(false);
    setEditing(null);
    load(1);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this enquiry?")) return;
    await deleteEnquiry(id);
    load(meta.page);
  };

  const applyFilters = () => {
    load(1);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      source: "",
      status: "",
      startDate: "",
      endDate: ""
    });
    load(1);
  };

  return (
    <div className="p-6 bg-[#f5f7fb] min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0a1a44]">
            Admission Enquiries
            <span className="ml-2 text-sm bg-[#e6ebff] px-2 py-1 rounded-full">
              {meta.total}
            </span>
          </h2>
          <p className="text-sm text-gray-500">
            Manage and follow up admission enquiries
          </p>
        </div>

        <button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="bg-[#0a1a44] text-white px-5 py-2 rounded-lg shadow hover:bg-[#122a6f]"
        >
          Add New Enquiry
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <div className="grid grid-cols-6 gap-4">
          <input
            placeholder="Search name, phone, email"
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
            className="filter-input col-span-2"
          />

          <select
            value={filters.source}
            onChange={(e) =>
              setFilters({ ...filters, source: e.target.value })
            }
            className="filter-input"
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
            className="filter-input"
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
            className="filter-input"
          />

          <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
            className="filter-input"
          />
        </div>

        {/* Apply / Reset */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-[#0a1a44] text-white rounded-lg hover:bg-[#122a6f]"
          >
            Apply
          </button>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-[#f0f3ff] text-[#0a1a44] text-sm uppercase">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Action</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Source</th>
              <th className="p-3 text-left">Enquiry Date</th>
              <th className="p-3 text-left">Follow Up</th>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Mobile</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-6 text-center text-gray-500">
                  No enquiries found.
                </td>
              </tr>
            ) : (
              data.map((r, idx) => (
                <tr key={r._id} className="border-t hover:bg-[#f5f7fb]">
                  <td className="p-3">
                    {(meta.page - 1) * meta.limit + idx + 1}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => {
                        setEditing(r);
                        setModalOpen(true);
                      }}
                      className="text-blue-600 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        r.status === "Active"
                          ? "bg-blue-100 text-blue-700"
                          : r.status === "Done"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3">{r.source}</td>
                  <td className="p-3">
                    {r.enquiryDate &&
                      new Date(r.enquiryDate).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {r.followUpDate &&
                      new Date(r.followUpDate).toLocaleDateString()}
                  </td>
                  <td className="p-3">{r.name}</td>
                  <td className="p-3">{r.phone}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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

      <style>{`
        .filter-input {
          padding: 0.6rem;
          border: 1px solid #dbe2f1;
          border-radius: 0.5rem;
          width: 100%;
        }
      `}</style>
    </div>
  );
}
