import React, { useEffect, useState } from "react";
import api from "../../../apis/axios";
import FeeDetails from "../../../modules/students/components/FeeDetails"; 

const MakePaymentPage = ({ studentId, classId }) => {
  const [feeData, setFeeData] = useState({});
  const [totalFee, setTotalFee] = useState(0);
  const [payments, setPayments] = useState([]);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("UPI");
  const [screenshotUrl, setScreenshotUrl] = useState("");

  // load fee details
  useEffect(() => {
    if (studentId) {
      api.get(`/api/fees/student/${studentId}`)
        .then(res => {
          const { feeData, totalFee, payments } = res.data.data;
          setFeeData(feeData);
          setTotalFee(totalFee);
          setPayments(payments);
        })
        .catch(err => console.error("Failed to load fee details:", err));
    }
  }, [studentId]);

  const uploadProof = async () => {
    try {
      const payload = {
        studentId,
        classId,
        feeStructureId: payments[0]?.feeStructureId || "", // adjust if needed
        amount: Number(amount),
        mode,
        screenshotUrl
      };
      await api.post("/api/payments/upload", payload);
      alert("Payment proof uploaded. Waiting for verification.");
      // reload fee details
      const res = await api.get(`/api/fees/student/${studentId}`);
      const { feeData, totalFee, payments } = res.data.data;
      setFeeData(feeData);
      setTotalFee(totalFee);
      setPayments(payments);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-bold text-[#0a1a44]">Make Payment</h2>

      {/* Fee Details */}
      <FeeDetails
        student={{ _id: studentId }}
        feeData={feeData}
        totalFee={totalFee}
        payments={payments}
        onRecordPayment={uploadProof}
      />

      {/* Payment Form */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <input
          type="number"
          placeholder="Amount"
          className="border p-2 rounded w-40"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={mode}
          onChange={e => setMode(e.target.value)}
        >
          <option value="UPI">UPI</option>
          <option value="Cash">Cash</option>
          <option value="BankTransfer">Bank Transfer</option>
        </select>
        <input
          type="url"
          placeholder="Screenshot URL"
          className="border p-2 rounded w-full"
          value={screenshotUrl}
          onChange={e => setScreenshotUrl(e.target.value)}
        />
        <button
          onClick={uploadProof}
          className="px-4 py-2 bg-[#0a1a44] text-white rounded hover:bg-[#132b6b]"
        >
          Upload Proof
        </button>
      </div>
    </div>
  );
};

export default MakePaymentPage;
