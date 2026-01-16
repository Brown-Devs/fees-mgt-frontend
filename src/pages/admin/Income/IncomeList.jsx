import React, { useEffect, useState } from "react";
import {
  fetchIncomes,
  createIncome,
  updateIncome,
  deleteIncome
} from "../../../services/incomeService";
import IncomeFormModal from "./IncomeFormModal";

const toCSV = (rows) => {
  const headers = [
    "SR NO",
    "Title",
    "Amount",
    "Payment Mode",
    "Status",
    "Receipt No",
    "Collector",
    "Role",
    "Type",
    "Due Date",
    "Created At"
  ];
  const lines = [headers.join(",")];

  rows.forEach((r, idx) => {
    lines.push([
      idx + 1,
      `"${r.title || ""}"`,
      r.amount ?? 0,
      `"${r.paymentMode || ""}"`,
      `"${r.paymentStatus || ""}"`,
      `"${r.receiptNumber || ""}"`,
      `"${r.collectorName || ""}"`,
      `"${r.collectorRole || ""}"`,
      `"${r.incomeType || ""}"`,
      `"${r.dueDate ? new Date(r.dueDate).toLocaleDateString() : ""}"`,
      `"${r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}"`
    ].join(","));
  });

  return lines.join("\n");
};

export default function IncomeList() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20 });
  const [filters, setFilters] = useState({
    search: "",
    paymentStatus: "",
    incomeType: "",
    paymentMode: "",
    startDueDate: "",
    endDueDate: ""
  });
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetchIncomes({ ...filters, page, limit: meta.limit });
      setData(res.data.data || []);
      setMeta(res.data.meta || { total: 0, page, limit: meta.limit });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, []);

  const handleSave = async (payload) => {
    if (editing) await updateIncome(editing._id, payload);
    else await createIncome(payload);
    setModalOpen(false);
    setEditing(null);
    load(1);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this income record?")) return;
    await deleteIncome(id);
    load(meta.page);
  };

  const handleExport = () => {
    const csv = toCSV(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `incomes_page_${meta.page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-[#f5f7fb] min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0a1a44]">
            Income Panel
            <span className="ml-2 text-sm bg-[#e6ebff] px-2 py-1 rounded-full">
              {meta.total}
            </span>
          </h2>
          <p className="text-sm text-gray-500">
            Record and manage income entries
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => { setEditing(null); setModalOpen(true); }}
            className="bg-[#0a1a44] text-white px-5 py-2 rounded-lg shadow hover:bg-[#122a6f]"
          >
            Add Income
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
            placeholder="Search title, receipt, collector"
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
            className="filter-input col-span-2"
          />
          <select
            value={filters.paymentStatus}
            onChange={e => setFilters({ ...filters, paymentStatus: e.target.value })}
            className="filter-input"
          >
            <option value="">All Status</option>
            <option>Full</option>
            <option>Partial</option>
          </select>
          <select
            value={filters.incomeType}
            onChange={e => setFilters({ ...filters, incomeType: e.target.value })}
            className="filter-input"
          >
            <option value="">All Types</option>
            <option>Fee</option>
            <option>Non Fee</option>
          </select>
          <select
            value={filters.paymentMode}
            onChange={e => setFilters({ ...filters, paymentMode: e.target.value })}
            className="filter-input"
          >
            <option value="">All Modes</option>
            <option>Cash</option>
            <option>Card</option>
            <option>Bank Transfer</option>
            <option>UPI</option>
            <option>Other</option>
          </select>
          <input
            type="date"
            value={filters.startDueDate}
            onChange={e => setFilters({ ...filters, startDueDate: e.target.value })}
            className="filter-input"
          />
          <input
            type="date"
            value={filters.endDueDate}
            onChange={e => setFilters({ ...filters, endDueDate: e.target.value })}
            className="filter-input"
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => load(1)}
            className="px-4 py-2 bg-[#0a1a44] text-white rounded-lg hover:bg-[#122a6f]"
          >
            Apply
          </button>
          <button
            onClick={() => {
              setFilters({
                search: "",
                paymentStatus: "",
                incomeType: "",
                paymentMode: "",
                startDueDate: "",
                endDueDate: ""
              });
              load(1);
            }}
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
              <th className="p-3 text-left">Pay Mode</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Receipt</th>
              <th className="p-3 text-left">Collector</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Due Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="10" className="p-6 text-center">Loading...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan="10" className="p-6 text-center text-gray-500">No income records found.</td></tr>
            ) : data.map((r, idx) => (
              <tr key={r._id} className="border-t hover:bg-[#f5f7fb]">
                <td className="p-3">{(meta.page - 1) * meta.limit + idx + 1}</td>
                <td className="p-3">
                  <button onClick={() => { setEditing(r); setModalOpen(true); }} className="text-blue-600 mr-3">Edit</button>
                  <button onClick={() => handleDelete(r._id)} className="text-red-600">Delete</button>
                </td>
                <td className="p-3">{r.title}</td>
                <td className="p-3">{r.amount}</td>
                <td className="p-3">{r.paymentMode}</td>
                <td className="p-3">{r.paymentStatus}</td>
                <td className="p-3">{r.receiptNumber || "-"}</td>
                <td className="p-3">
                  {r.collectorName}
                  {r.collectorRole ? ` (${r.collectorRole})` : ""}
                </td>
                <td className="p-3">{r.incomeType}</td>
                <td className="p-3">
                  {r.dueDate ? new Date(r.dueDate).toLocaleDateString() : "-"}
                </td>
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

      <IncomeFormModal
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
