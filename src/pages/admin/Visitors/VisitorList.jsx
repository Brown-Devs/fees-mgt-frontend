import React, { useEffect, useState } from "react";
import {
  fetchVisitors,
  createVisitor,
  updateVisitor,
  deleteVisitor
} from "../../../services/visitorService";
import VisitorFormModal from "./VisitorFormModal";
import PageHeader from "../../../components/common/PageHeader";
import TableCard from "../../../components/common/TableCard";

export default function VisitorList() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20 });
  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
    meetingWith: ""
  });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetchVisitors({ ...filters, page, limit: meta.limit });
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
    if (editing) await updateVisitor(editing._id, payload);
    else await createVisitor(payload);
    setModalOpen(false);
    setEditing(null);
    load(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this visitor record?")) return;
    await deleteVisitor(id);
    load(meta.page);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/80 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <PageHeader
            title="Visitors"
            subtitle="Track visitor entry, exit and meeting details."
            buttonText="+ Add Visitor"
            onButtonClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            <span className="bg-[#001f3f]/10 text-[#001f3f] text-xs font-medium px-3 py-1.5 rounded-full">
              {meta.total} Total
            </span>
          </PageHeader>

          <TableCard title="Visitor Records">

            {/* Filters */}
            <div className="grid md:grid-cols-6 gap-4 mb-6">
              <input
                placeholder="Search name, phone, ID"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-xl"
              />

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

              <input
                placeholder="Meeting With"
                value={filters.meetingWith}
                onChange={(e) =>
                  setFilters({ ...filters, meetingWith: e.target.value })
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
                    startDate: "",
                    endDate: "",
                    meetingWith: ""
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
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Visitor</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Phone</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Meeting With</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Persons</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">In</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Out</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {loading ? (
                    <tr>
                      <td colSpan="9" className="px-6 py-10 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-6 py-10 text-center text-gray-400">
                        No visitors found.
                      </td>
                    </tr>
                  ) : (
                    data.map((r, idx) => (
                      <tr key={r._id} className="hover:bg-[#001f3f]/[0.02]">
                        <td className="px-6 py-4">
                          {(meta.page - 1) * meta.limit + idx + 1}
                        </td>

                        <td className="px-6 py-4 font-medium text-gray-800">
                          {r.name}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {r.phone}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {r.meetingWith || "-"}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {r.totalPerson}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {r.date &&
                            new Date(r.date).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {r.inTime || "-"}
                        </td>

                        <td className="px-6 py-4 text-gray-600">
                          {r.outTime || "-"}
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

      <VisitorFormModal
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
