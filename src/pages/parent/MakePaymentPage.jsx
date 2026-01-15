// src/pages/parent/MakePaymentPage.jsx
import React, { useEffect, useState } from "react";
import api from "../../apis/axios";

const ParentMakePaymentPage = ({ studentId }) => {
  const [fee, setFee] = useState(null);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("UPI");
  const [file, setFile] = useState(null);

  // Replace with real school QR/UPI fetch if needed
  const [upiId, setUpiId] = useState("school@upi");
  const [qrUrl, setQrUrl] = useState("https://via.placeholder.com/160");

  useEffect(() => {
    if (!studentId) return;
    api.get(`/fees/student/${studentId}`).then(res => {
      setFee(res.data.data);
      if (res.data.data?.outstanding) setAmount(res.data.data.outstanding);
    }).catch(err => console.error(err));
  }, [studentId]);

  const uploadProof = async () => {
    if (!file) return alert("Please select a screenshot image");
    if (!fee?.feeStructureId) return alert("No fee structure found");
    const formData = new FormData();
    formData.append("studentId", studentId);
    formData.append("classId", fee.classId || fee?.feeData?.classId || ""); // adjust if needed
    formData.append("feeStructureId", fee.feeStructureId);
    formData.append("amount", Number(amount));
    formData.append("mode", mode);
    formData.append("screenshot", file);

    try {
      await api.post("/payments/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Payment proof uploaded. Awaiting verification.");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Make Payment</h2>

      {fee && (
        <div className="bg-gray-50 p-4 rounded space-y-2">
          <p><strong>Total:</strong> {fee.totalFee}</p>
          <p><strong>Paid:</strong> {fee.paid}</p>
          <p><strong>Outstanding:</strong> {fee.outstanding}</p>
        </div>
      )}

      <div className="flex items-center gap-6">
        <div>
          <p className="font-semibold">School UPI ID</p>
          <p>{upiId}</p>
        </div>
        <div>
          <p className="font-semibold">QR Code</p>
          <img src={qrUrl} alt="UPI QR" className="w-40 h-40 border rounded" />
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded space-y-3">
        <input
          type="number"
          className="border p-2 rounded w-48"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <select
          className="border p-2 rounded w-48"
          value={mode}
          onChange={e => setMode(e.target.value)}
        >
          <option value="UPI">UPI</option>
          <option value="BankTransfer">Bank Transfer</option>
          <option value="Cash">Cash</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={e => setFile(e.target.files[0])}
          className="block"
        />

        <button
          onClick={uploadProof}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Upload Screenshot
        </button>
      </div>
    </div>
  );
};

export default ParentMakePaymentPage;
