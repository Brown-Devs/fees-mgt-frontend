// src/pages/admin/Payments/AdminVerifyPaymentPage.jsx
import React, { useEffect, useState } from "react";
import api from "../../../apis/axios";

const AdminVerifyPaymentPage = () => {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [section, setSection] = useState("");
  const [stream, setStream] = useState("");
  const [payments, setPayments] = useState([]);

  // Fetch classes
  useEffect(() => {
    api.get("/api/classes")
      .then(res => setClasses(res.data.data))
      .catch(err => console.error("Failed to load classes:", err));
  }, []);

  // Auto-fill section & stream when class selected
  useEffect(() => {
    if (!classId) {
      setSection("");
      setStream("");
      return;
    }
    const selectedClass = classes.find(c => c._id === classId);
    if (selectedClass) {
      setSection(selectedClass.section);
      setStream(selectedClass.stream);
    }
  }, [classId, classes]);

  // Fetch payments when class changes
  useEffect(() => {
    if (!classId) return;
    api.get(`/api/payments/class/${classId}`, { params: { section, stream } })
      .then(res => setPayments(res.data.data || []))
      .catch(err => console.error("Failed to load payments:", err));
  }, [classId, section, stream]);

  const verify = async (paymentId) => {
    try {
      await api.post(`/api/payments/verify/${paymentId}`);
      setPayments(prev =>
        prev.map(p => p._id === paymentId ? { ...p, status: "Verified" } : p)
      );
    } catch (err) {
      console.error(err);
      alert("Verification failed");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Verify Payments</h2>

      {/* Class dropdown */}
      <select
        className="border p-2 rounded"
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

      {/* Payments table */}
      <div className="overflow-auto">
        <table className="min-w-full border mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Student</th>
              <th className="p-2 border">Roll No</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Mode</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Proof</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p._id}>
                <td className="p-2 border">
                  {p.studentId?.firstName} {p.studentId?.lastName}
                </td>
                <td className="p-2 border">{p.studentId?.rollNo}</td>
                <td className="p-2 border">{p.amount}</td>
                <td className="p-2 border">{p.mode}</td>
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      p.status === "Pending" ? "bg-yellow-500" : "bg-green-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-2 border">
                  {p.screenshotUrl ? (
                    <a href={p.screenshotUrl} target="_blank" rel="noreferrer">
                      <img
                        src={p.screenshotUrl}
                        alt="proof"
                        className="w-16 h-16 object-cover border rounded"
                      />
                    </a>
                  ) : (
                    <span className="text-gray-500">No image</span>
                  )}
                </td>
                <td className="p-2 border">
                  {p.status === "Pending" ? (
                    <button
                      onClick={() => verify(p._id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Verify
                    </button>
                  ) : (
                    <span className="text-gray-500">Verified</span>
                  )}
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-600">
                  No payments found for this class.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminVerifyPaymentPage;
