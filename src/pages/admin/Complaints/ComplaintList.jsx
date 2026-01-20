import React, { useEffect, useState } from "react";
import api from "../../../apis/axios";
import ComplaintForm from "./ComplaintForm";

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
        <div className="p-6 bg-[#f5f7fb] min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-[#0a1a44]">
                            Complaints
                        </h2>
                        <p className="text-sm text-gray-500">
                            Manage and track complaints
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 rounded-lg bg-[#0a1a44] text-white hover:bg-[#122a6f]"
                    >
                        Add Complaint
                    </button>
                </div>

                {/* Form */}
                {showForm && (
                    <ComplaintForm
                        onSaved={() => {
                            setShowForm(false);
                            load(1);
                        }}
                        onClose={() => setShowForm(false)}
                    />
                )}

                {/* Table */}
                <div className="bg-white rounded-2xl shadow overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-[#eef2ff] text-[#0a1a44] text-sm">
                            <tr>
                                <th className="p-3 text-left">SR</th>
                                <th className="p-3 text-left">Title</th>
                                <th className="p-3 text-left">Against</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Phone</th>
                                <th className="p-3 text-left">Date</th>
                                <th className="p-3 text-left">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-6 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-6 text-center text-gray-500">
                                        No complaints found
                                    </td>
                                </tr>
                            ) : (
                                data.map((r, idx) => (
                                    <tr
                                        key={r._id}
                                        className="border-t hover:bg-[#f8f9ff]"
                                    >
                                        <td className="p-3">
                                            {(meta.page - 1) * meta.limit + idx + 1}
                                        </td>
                                        <td className="p-3 font-medium">{r.title}</td>
                                        <td className="p-3">{r.complaintType}</td>
                                        <td className="p-3">
                                            <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                                                {r.complaintStatus || "Pending"}
                                            </span>
                                        </td>
                                        <td className="p-3">{r.phone || "-"}</td>
                                        <td className="p-3">
                                            {new Date(r.date).toLocaleDateString()}
                                        </td>
                                        <td className="p-3 text-gray-600">
                                            {r.description}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
