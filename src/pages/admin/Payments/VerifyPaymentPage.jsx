import React, { useEffect, useState } from "react";
import api from "../../../apis/axios";

const VerifyPaymentPage = () => {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [records, setRecords] = useState([]);

  // Load classes
  useEffect(() => {
    api.get("/api/classes")
      .then(res => setClasses(res.data.data))
      .catch(err => console.error("Failed to load classes:", err));
  }, []);

  // Load payments when class/status changes
  useEffect(() => {
    if (classId) {
      const url = `/api/payments/class/${classId}${statusFilter ? `?status=${statusFilter}` : ""}`;
      api.get(url)
        .then(res => setRecords(res.data.data))
        .catch(err => console.error("Failed to load payments:", err));
    } else {
      setRecords([]);
    }
  }, [classId, statusFilter]);

  const verifyPayment = async (paymentId) => {
    try {
      await api.post("/api/payments/verify", { paymentId });
      // reload
      const url = `/api/payments/class/${classId}${statusFilter ? `?status=${statusFilter}` : ""}`;
      const res = await api.get(url);
      setRecords(res.data.data);
    } catch (err) {
      console.error("Verification failed:", err);
      alert("Verification failed");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-[#0a1a44]">Verify Payments</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          className="border p-2"
          value={classId}
          onChange={e => setClassId(e.target.value)}
        >
          <option value="">Select Class</option>
          {classes.map(c => (
            <option key={c._id} value={c._id}>
              {c.name} ({c.section} - {c.stream})
            </option>
          ))}
        </select>

        <select
          className="border p-2"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Uploaded">Uploaded</option>
          <option value="Verified">Verified</option>
        </select>
      </div>

      {/* Table */}
      <table className="w-full border border-gray-300 rounded-lg shadow-sm">
        <thead className="bg-[#0a1a44] text-white">
          <tr>
            <th className="p-3">Roll No</th>
            <th className="p-3">Name</th>
            <th className="p-3">Fee</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Status</th>
            <th className="p-3">Proof</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, idx) => (
            <tr key={r._id} className={`border-t ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50`}>
              <td className="p-3">{r.studentId?.rollNo}</td>
              <td className="p-3">{r.studentId ? `${r.studentId.firstName} ${r.studentId.lastName || ""}` : "-"}</td>
              <td className="p-3">{r.feeStructureId?.session || "-"}</td>
              <td className="p-3">₹{r.amount}</td>
              <td className="p-3">{r.status}</td>
              <td className="p-3">
                {r.screenshotUrl ? (
                  <a href={r.screenshotUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                    View
                  </a>
                ) : "—"}
              </td>
              <td className="p-3 text-center">
                {r.status === "Uploaded" ? (
                  <button
                    onClick={() => verifyPayment(r._id)}
                    className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Verify
                  </button>
                ) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VerifyPaymentPage;
