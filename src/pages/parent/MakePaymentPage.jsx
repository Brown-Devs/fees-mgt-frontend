// src/pages/parent/MakePaymentPage.jsx
import React, { useEffect, useState } from "react";
import api from "../../apis/axios";

const NAVY = "#0a1a44";

const ParentMakePaymentPage = ({ studentId }) => {
  const [fee, setFee] = useState(null);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("UPI");
  const [file, setFile] = useState(null);

  // Replace later with real school data
  const [upiId] = useState("school@upi");
  const [qrUrl] = useState("https://via.placeholder.com/160");

  useEffect(() => {
    if (!studentId) return;

    api
      .get(`/fees/student/${studentId}`)
      .then((res) => {
        setFee(res.data.data);
        if (res.data.data?.outstanding)
          setAmount(res.data.data.outstanding);
      })
      .catch((err) => console.error(err));
  }, [studentId]);

  const uploadProof = async () => {
    if (!file) return alert("Please select a payment screenshot");
    if (!fee?.feeStructureId) return alert("No fee structure found");

    const formData = new FormData();
    formData.append("studentId", studentId);
    formData.append(
      "classId",
      fee.classId || fee?.feeData?.classId || ""
    );
    formData.append("feeStructureId", fee.feeStructureId);
    formData.append("amount", Number(amount));
    formData.append("mode", mode);
    formData.append("screenshot", file);

    try {
      await api.post("/payments/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Payment proof uploaded. Awaiting verification.");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="space-y-8">

      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-[#0a1a44] to-[#122b6b]
                      text-white rounded-2xl p-6 shadow">
        <h2 className="text-2xl font-semibold">
          Make Fee Payment
        </h2>
        <p className="text-white/80 text-sm mt-1">
          Pay school fees and upload payment proof
        </p>
      </div>

      {/* ================= FEE SUMMARY ================= */}
      {fee && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard title="Total Fee" value={fee.totalFee} />
          <SummaryCard title="Paid" value={fee.paid} />
          <SummaryCard
            title="Outstanding"
            value={fee.outstanding}
            highlight
          />
        </div>
      )}

      {/* ================= UPI / QR ================= */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h3 className="text-lg font-semibold text-[#0a1a44] mb-4">
          Pay Using UPI / Bank
        </h3>

        <div className="flex flex-col md:flex-row items-start gap-8">
          <div>
            <p className="text-sm font-medium text-slate-500">
              School UPI ID
            </p>
            <p className="text-lg font-semibold text-[#0a1a44]">
              {upiId}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">
              Scan QR Code
            </p>
            <img
              src={qrUrl}
              alt="UPI QR"
              className="w-40 h-40 rounded-lg border"
            />
          </div>
        </div>
      </div>

      {/* ================= UPLOAD FORM ================= */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-4">
        <h3 className="text-lg font-semibold text-[#0a1a44]">
          Upload Payment Proof
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            className="border rounded-lg px-3 py-2"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount Paid"
          />

          <select
            className="border rounded-lg px-3 py-2"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="UPI">UPI</option>
            <option value="BankTransfer">Bank Transfer</option>
            <option value="Cash">Cash</option>
          </select>
        </div>

        {/* ============ FIXED FILE INPUT ============ */}
        <div className="space-y-2">
          <input
            id="payment-proof"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />

          <label
            htmlFor="payment-proof"
            className="flex items-center justify-center
                       w-full px-5 py-3 rounded-xl cursor-pointer
                       border-2 border-dashed border-[#0a1a44]/30
                       text-[#0a1a44] font-medium
                       hover:bg-[#eef2ff] transition"
          >
            {file ? "Change Screenshot" : "Upload Payment Screenshot"}
          </label>

          {file && (
            <p className="text-sm text-slate-500 text-center">
              Selected file:{" "}
              <span className="font-medium">{file.name}</span>
            </p>
          )}
        </div>

        <button
          onClick={uploadProof}
          className="mt-2 px-6 py-2.5 rounded-lg
                     bg-[#0a1a44] text-white font-medium
                     hover:bg-[#122b6b] transition"
        >
          Upload Screenshot
        </button>
      </div>
    </div>
  );
};

export default ParentMakePaymentPage;

/* ===================== SUMMARY CARD ===================== */
function SummaryCard({ title, value, highlight }) {
  return (
    <div
      className={`rounded-xl p-4 shadow-sm border
        ${highlight ? "bg-[#0a1a44] text-white" : "bg-white"}`}
    >
      <p
        className={`text-sm ${highlight ? "text-white/80" : "text-slate-500"
          }`}
      >
        {title}
      </p>
      <p className="text-2xl font-semibold mt-1">
        {value}
      </p>
    </div>
  );
}
