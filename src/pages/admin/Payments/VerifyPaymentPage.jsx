import React, { useEffect, useState } from "react";
import api from "../../../apis/axios";

const AdminVerifyPaymentPage = () => {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [section, setSection] = useState("");
  const [stream, setStream] = useState("");
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    api.get("/api/classes")
      .then(res => setClasses(res.data.data))
      .catch(err => console.error("Failed to load classes:", err));
  }, []);

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
    <div className="p-6 bg-[#f5f7fb] min-h-screen">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#0a1a44]">
          Verify Payments
        </h2>
        <p className="text-sm text-gray-500">
          Review and verify pending student fee payments
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-5 mb-6 w-full max-w-md">
        <label className="block text-sm font-semibold text-gray-600 mb-2">
          Select Class
        </label>
        <select
          className="input-style"
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
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto border">
        <table className="min-w-full">
          <thead className="bg-[#f0f3ff] text-[#0a1a44] text-sm uppercase">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Roll No</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Mode</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Proof</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {payments.map(p => (
              <tr key={p._id} className="border-t hover:bg-[#f5f7fb]">
                <td className="p-3">
                  {p.studentId?.firstName} {p.studentId?.lastName}
                </td>
                <td className="p-3">{p.studentId?.rollNo}</td>
                <td className="p-3 font-medium">₹{p.amount}</td>
                <td className="p-3">{p.mode}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      p.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="p-3">
                  {p.screenshotUrl ? (
                    <a href={p.screenshotUrl} target="_blank" rel="noreferrer">
                      <img
                        src={p.screenshotUrl}
                        alt="Payment Proof"
                        className="w-14 h-14 object-cover rounded-lg border hover:scale-105 transition"
                      />
                    </a>
                  ) : (
                    <span className="text-sm text-gray-400">No image</span>
                  )}
                </td>
                <td className="p-3">
                  {p.status === "Pending" ? (
                    <button
                      onClick={() => verify(p._id)}
                      className="px-4 py-1.5 bg-[#0a1a44] text-white rounded-lg hover:bg-[#122a6f]"
                    >
                      Verify
                    </button>
                  ) : (
                    <span className="text-sm text-gray-400">Verified</span>
                  )}
                </td>
              </tr>
            ))}

            {payments.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-500">
                  No payments found for this class.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .input-style {
          padding: 0.6rem;
          border: 1px solid #dbe2f1;
          border-radius: 0.5rem;
          width: 100%;
        }
        .input-style:focus {
          outline: none;
          border-color: #0a1a44;
          box-shadow: 0 0 0 2px rgba(10,26,68,0.15);
        }
      `}</style>
    </div>
  );
};

export default AdminVerifyPaymentPage;
