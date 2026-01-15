import React, { useEffect, useState } from "react";
import { fetchVisitors, createVisitor, updateVisitor, deleteVisitor } from "../../../services/visitorService";
import VisitorFormModal from "./VisitorFormModal";

const toCSV = (rows) => {
  const headers = ["SR NO","Visitor Name","ID No","Phone","Meeting With","Total Person","Date","In Time","Out Time","Purpose"];
  const lines = [headers.join(",")];
  rows.forEach((r, idx) => {
    lines.push([
      idx + 1,
      `"${r.name || ""}"`,
      `"${r.idNo || ""}"`,
      `"${r.phone || ""}"`,
      `"${r.meetingWith || ""}"`,
      r.totalPerson || 1,
      `"${r.date ? new Date(r.date).toLocaleDateString() : ""}"`,
      `"${r.inTime || ""}"`,
      `"${r.outTime || ""}"`,
      `"${r.purpose || ""}"`
    ].join(","));
  });
  return lines.join("\n");
};

export default function VisitorList() {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20 });
  const [filters, setFilters] = useState({ search: "", startDate: "", endDate: "" , meetingWith: ""});
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetchVisitors({ ...filters, page, limit: meta.limit });
      setData(res.data.data || []);
      setMeta(res.data.meta || { total: 0, page, limit: meta.limit });
    } catch (err) {
      console.error("Error loading visitors:", err);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(1); }, []);

  const handleSave = async (payload) => {
    try {
      if (editing) {
        await updateVisitor(editing._id, payload);
      } else {
        await createVisitor(payload);
      }
      setModalOpen(false);
      setEditing(null);
      load(1);
    } catch (err) {
      console.error("Error saving visitor:", err);
      alert("Failed to save. Check console.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this visitor record?")) return;
    try {
      await deleteVisitor(id);
      load(meta.page);
    } catch (err) {
      console.error("Error deleting visitor:", err);
      alert("Failed to delete.");
    }
  };

  const handleExport = () => {
    const csv = toCSV(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `visitors_page_${meta.page}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-navy-700 text-2xl font-bold">Visitors List <span className="text-sm text-navy-500">({meta.total})</span></h2>
          <p className="text-sm text-navy-500">Track visitors, in/out times and meeting details</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => { setEditing(null); setModalOpen(true); }} className="flex items-center gap-2 bg-navy-700 text-white px-4 py-2 rounded-lg shadow hover:bg-navy-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New+
          </button>
          <button onClick={handleExport} className="bg-lightblue-100 text-navy-700 px-3 py-2 rounded-lg shadow hover:bg-lightblue-200">Export CSV</button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 border border-lightblue-100">
        <div className="grid grid-cols-6 gap-3">
          <input placeholder="Search name, phone, id" value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} className="p-2 border border-lightblue-200 rounded col-span-2" />
          <input type="date" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} className="p-2 border border-lightblue-200 rounded" />
          <input type="date" value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})} className="p-2 border border-lightblue-200 rounded" />
          <input placeholder="Meeting With" value={filters.meetingWith} onChange={e => setFilters({...filters, meetingWith: e.target.value})} className="p-2 border border-lightblue-200 rounded" />
          <div className="col-span-6 flex justify-end gap-3 mt-2">
            <button onClick={() => load(1)} className="px-4 py-2 bg-lightblue-100 text-navy-700 rounded hover:bg-lightblue-200">Search</button>
            <button onClick={() => { setFilters({ search: "", startDate: "", endDate: "", meetingWith: "" }); load(1); }} className="px-4 py-2 bg-gray-100 rounded">Reset</button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto border border-lightblue-100">
        <table className="min-w-full">
          <thead className="bg-lightblue-50 text-navy-700">
            <tr>
              <th className="p-3 text-left">SR NO.</th>
              <th className="p-3 text-left">ACTION</th>
              <th className="p-3 text-left">VISITOR NAME</th>
              <th className="p-3 text-left">ID NO.</th>
              <th className="p-3 text-left">PHONE NO.</th>
              <th className="p-3 text-left">MEETING WITH</th>
              <th className="p-3 text-left">TOTAL PERSON</th>
              <th className="p-3 text-left">DATE</th>
              <th className="p-3 text-left">IN TIME</th>
              <th className="p-3 text-left">OUT TIME</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="10" className="p-6 text-center text-navy-600">Loading...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan="10" className="p-6 text-center text-navy-600">No visitors found.</td></tr>
            ) : data.map((r, idx) => (
              <tr key={r._id} className="border-t hover:bg-lightblue-50">
                <td className="p-3">{(meta.page - 1) * meta.limit + idx + 1}</td>
                <td className="p-3">
                  <button onClick={() => { setEditing(r); setModalOpen(true); }} className="text-lightblue-600 mr-3 hover:text-navy-700">Edit</button>
                  <button onClick={() => handleDelete(r._id)} className="text-red-500 hover:text-red-700">Delete</button>
                </td>
                <td className="p-3">{r.name}</td>
                <td className="p-3">{r.idNo || "-"}</td>
                <td className="p-3">{r.phone}</td>
                <td className="p-3">{r.meetingWith || "-"}</td>
                <td className="p-3">{r.totalPerson}</td>
                <td className="p-3">{r.date ? new Date(r.date).toLocaleDateString() : "-"}</td>
                <td className="p-3">{r.inTime || "-"}</td>
                <td className="p-3">{r.outTime || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-navy-600">Showing {data.length} of {meta.total}</div>
        <div className="flex gap-2">
          <button disabled={meta.page <= 1} onClick={() => load(meta.page - 1)} className="px-3 py-1 bg-lightblue-100 text-navy-700 rounded disabled:opacity-50">Prev</button>
          <button disabled={meta.page * meta.limit >= meta.total} onClick={() => load(meta.page + 1)} className="px-3 py-1 bg-lightblue-100 text-navy-700 rounded disabled:opacity-50">Next</button>
        </div>
      </div>

      <VisitorFormModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} onSave={handleSave} initial={editing} />
    </div>
  );
}
