import React, { useEffect, useState } from "react";
import {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense
} from "../../../services/expenseService";
import ExpenseFormModal from "./ExpenseFormModal";

const toCSV = (rows) => {
  const headers = [
    "SR NO",
    "Title",
    "Amount",
    "Person/Vendor",
    "Invoice URL",
    "Date",
    "Description",
    "Created At"
  ];
  const lines = [headers.join(",")];

  rows.forEach((r, idx) => {
    lines.push([
      idx + 1,
      `"${r.title || ""}"`,
      r.amount ?? 0,
      `"${r.personName || ""}"`,
      `"${r.invoiceUrl || ""}"`,
      `"${r.date ? new Date(r.date).toLocaleDateString() : ""}"`,
      `"${(r.description || "").replace(/"/g, '""')}"`,
      `"${r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}"`
    ].join(","));
  });

  return lines.join("\n");
};

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
    if (!confirm("Delete this expense record?")) return;
    await deleteExpense(id);
    load(meta.page);
  };

  const applyFilters = () => load(1);

  const resetFilters = () => {
    setFilters({
      search: "",
      minAmount: "",
      maxAmount: "",
      startDate: "",
      endDate: ""
    });
    load(1);
  };

  const handleExport = () => {
    const csv = toCSV(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses_page_${meta.page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-[#f5f7fb] min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0a1a44]">
            Expenses
            <span className="ml-2 text-sm bg-[#e6ebff] px-2 py-1 rounded-full">
              {meta.total}
            </span>
          </h2>
          <p className="text-sm text-gray-500">
            Record and manage expense entries
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => { setEditing(null); setModalOpen(true); }}
            className="bg-[#0a1a44] text-white px-5 py-2 rounded-lg shadow hover:bg-[#122a6f]"
          >
            Add Expense
          </button>
          <button
            onClick={handleExport}
            className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <div className="grid grid-cols-6 gap-4">
          <input
            placeholder="Search title, person, description"
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
            className="filter-input col-span-2"
          />
          <input
            type="number"
            placeholder="Min Amount"
            value={filters.minAmount}
            onChange={e => setFilters({ ...filters, minAmount: e.target.value })}
            className="filter-input"
          />
          <input
            type="number"
            placeholder="Max Amount"
            value={filters.maxAmount}
            onChange={e => setFilters({ ...filters, maxAmount: e.target.value })}
            className="filter-input"
          />
          <input
            type="date"
            value={filters.startDate}
            onChange={e => setFilters({ ...filters, startDate: e.target.value })}
            className="filter-input"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={e => setFilters({ ...filters, endDate: e.target.value })}
            className="filter-input"
          />
        </div>

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
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Person / Vendor</th>
              <th className="p-3 text-left">Invoice</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Description</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="p-6 text-center">Loading...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan="8" className="p-6 text-center text-gray-500">No expense records found.</td></tr>
            ) : data.map((r, idx) => (
              <tr key={r._id} className="border-t hover:bg-[#f5f7fb]">
                <td className="p-3">{(meta.page - 1) * meta.limit + idx + 1}</td>
                <td className="p-3">
                  <button onClick={() => { setEditing(r); setModalOpen(true); }} className="text-blue-600 mr-3">Edit</button>
                  <button onClick={() => handleDelete(r._id)} className="text-red-600">Delete</button>
                </td>
                <td className="p-3">{r.title}</td>
                <td className="p-3">{r.amount}</td>
                <td className="p-3">{r.personName || "-"}</td>
                <td className="p-3">
                  {r.invoiceUrl
                    ? <a href={r.invoiceUrl} target="_blank" rel="noreferrer" className="text-blue-600">View</a>
                    : "-"}
                </td>
                <td className="p-3">
                  {r.date ? new Date(r.date).toLocaleDateString() : "-"}
                </td>
                <td className="p-3">{r.description || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          Showing {data.length} of {meta.total}
        </div>
        <div className="flex gap-2">
          <button
            disabled={meta.page <= 1}
            onClick={() => load(meta.page - 1)}
            className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={meta.page * meta.limit >= meta.total}
            onClick={() => load(meta.page + 1)}
            className="px-3 py-1 bg-gray-100 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <ExpenseFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
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
