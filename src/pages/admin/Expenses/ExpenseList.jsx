import React, { useEffect, useState } from "react";
import {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense
} from "../../../services/expenseService";
import ExpenseFormModal from "./ExpenseFormModal";
import PageHeader from "../../../components/common/PageHeader";
import TableCard from "../../../components/common/TableCard";

export default function ExpenseList() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20 });
  const [filters, setFilters] = useState({
    search: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: ""
  });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetchExpenses({ ...filters, page, limit: meta.limit });
      setData(res.data.data || []);
      setMeta(res.data.meta || { total: 0, page, limit: meta.limit });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, []);

  const handleSave = async (payload) => {
    if (editing) await updateExpense(editing._id, payload);
    else await createExpense(payload);
    setModalOpen(false);
    setEditing(null);
    load(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense record?")) return;
    await deleteExpense(id);
    load(meta.page);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/80 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <PageHeader
            title="Expense Management"
            subtitle="Record and manage expense entries."
            buttonText="+ Add Expense"
            onButtonClick={() => { setEditing(null); setModalOpen(true); }}
          >
            
          </PageHeader>

          <TableCard title="Expense Records">

            {/* Filters */}
            <div className="grid md:grid-cols-6 gap-4 mb-6">
              <input
                placeholder="Search title, vendor, description"
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-xl"
              />
              <input
                type="number"
                placeholder="Min Amount"
                value={filters.minAmount}
                onChange={e => setFilters({ ...filters, minAmount: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-xl"
              />
              <input
                type="number"
                placeholder="Max Amount"
                value={filters.maxAmount}
                onChange={e => setFilters({ ...filters, maxAmount: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-xl"
              />
              <input
                type="date"
                value={filters.startDate}
                onChange={e => setFilters({ ...filters, startDate: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-xl"
              />
              <input
                type="date"
                value={filters.endDate}
                onChange={e => setFilters({ ...filters, endDate: e.target.value })}
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
                    minAmount: "",
                    maxAmount: "",
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
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Title</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Vendor</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Invoice</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
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
                        No expense records found
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
                          ₹{r.amount}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {r.personName || "-"}
                        </td>
                        <td className="px-6 py-4">
                          {r.invoiceUrl ? (
                            <a
                              href={r.invoiceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#001f3f] font-medium hover:underline"
                            >
                              View
                            </a>
                          ) : "-"}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {r.date ? new Date(r.date).toLocaleDateString() : "-"}
                        </td>
                        <td className="px-6 py-4 text-center space-x-3">
                          <button
                            onClick={() => { setEditing(r); setModalOpen(true); }}
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

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Showing {data.length} of {meta.total}
              </div>
              <div className="flex gap-2">
                <button
                  disabled={meta.page <= 1}
                  onClick={() => load(meta.page - 1)}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  disabled={meta.page * meta.limit >= meta.total}
                  onClick={() => load(meta.page + 1)}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>

          </TableCard>

        </div>
      </div>

      <ExpenseFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave}
        initial={editing}
      />
    </>
  );
}
