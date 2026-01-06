import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../apis/axios";
import FeeDetails from "../../../modules/students/components/FeeDetails";

const MakePaymentPage = () => {
  const { studentId, classId } = useParams();

  const [feeData, setFeeData] = useState({});
  const [totalFee, setTotalFee] = useState(0);
  const [paid, setPaid] = useState(0);
  const [outstanding, setOutstanding] = useState(0);
  const [payments, setPayments] = useState([]);
  const [feeStructureId, setFeeStructureId] = useState(null);

  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("UPI");
  const [screenshotUrl, setScreenshotUrl] = useState("");

  useEffect(() => {
    if (!studentId) return;

    console.log("➡️ Calling API for student:", studentId);

    api.get(`/fees/student/${studentId}`)
      .then(res => {
        console.log("✅ API response:", res.data);

        const {
          feeData,
          totalFee,
          payments,
          feeStructureId,
          paid,
          outstanding
        } = res.data.data;

        setFeeData(feeData);
        setTotalFee(totalFee);
        setPayments(payments);
        setFeeStructureId(feeStructureId);
        setPaid(paid);
        setOutstanding(outstanding);
        setAmount(totalFee);
      })
      .catch(err => console.error("❌ Failed to load fee details:", err));
  }, [studentId]);

  const uploadProof = async () => {
    try {
      if (!feeStructureId) {
        alert("Fee structure not found");
        return;
      }

      const payload = {
        studentId,
        classId,
        feeStructureId,
        amount: Number(amount),
        mode,
        screenshotUrl
      };

      console.log("➡️ Uploading payment proof:", payload);

      await api.post("/payments/upload", payload);

      alert("Payment proof uploaded. Waiting for verification.");

      const res = await api.get(`/fees/student/${studentId}`);
      console.log("✅ Refetched API response after upload:", res.data);

      const {
        feeData,
        totalFee,
        payments,
        feeStructureId,
        paid,
        outstanding
      } = res.data.data;

      setFeeData(feeData);
      setTotalFee(totalFee);
      setPayments(payments);
      setFeeStructureId(feeStructureId);
      setPaid(paid);
      setOutstanding(outstanding);

    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Upload failed");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-bold text-[#0a1a44]">Make Payment</h2>

      <FeeDetails
        student={{ _id: studentId }}
        feeData={feeData}
        totalFee={totalFee}
        paid={paid}
        outstanding={outstanding}
        payments={payments}
        onRecordPayment={uploadProof}
      />

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
