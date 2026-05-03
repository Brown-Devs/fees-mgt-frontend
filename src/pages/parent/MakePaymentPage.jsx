// src/pages/parent/MakePaymentPage.jsx
import React, { useEffect, useState } from "react";
import api from "../../apis/axios";
import { useStudentByParent } from "./hooks/useStudentByParent";
import { PageShell, Card, CardTitle, StatCard, Spinner, ErrorBox } from "./components/ui";

export default function ParentMakePaymentPage() {
  const { student, loading: sLoad, error: sErr } = useStudentByParent();

  const [fee,       setFee]      = useState(null);
  const [school,    setSchool]   = useState(null);
  const [feeLoad,   setFeeLoad]  = useState(false);
  const [amount,    setAmount]   = useState("");
  const [mode,      setMode]     = useState("UPI");
  const [file,      setFile]     = useState(null);
  const [uploading, setUploading]= useState(false);
  const [success,   setSuccess]  = useState(false);
  const [error,     setError]    = useState(null);

  useEffect(() => {
    if (!student) return;
    (async () => {
      setFeeLoad(true);
      try {
        const [fRes, sRes] = await Promise.all([
          api.get(`/api/fees/student/${student._id}`),
          api.get("/api/schools/me"),
        ]);
        const feeData = fRes.data.data;
        setFee(feeData);
        setAmount(feeData?.outstanding || "");
        setSchool(sRes.data.data);
      } catch { /* school info optional */ }
      finally { setFeeLoad(false); }
    })();
  }, [student]);

  const handleUpload = async () => {
    if (!file)   return setError("Please select a payment screenshot.");
    if (!amount) return setError("Please enter the amount paid.");
    if (!fee?.feeStructureId) return setError("No fee structure found for this student.");

    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("studentId",      student._id);
      form.append("classId",        student.classId?._id || "");
      form.append("feeStructureId", fee.feeStructureId);
      form.append("amount",         Number(amount));
      form.append("mode",           mode);
      form.append("screenshot",     file);
      await api.post("/api/payments/upload", form, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccess(true);
      setFile(null);
    } catch (err) {
      setError(err?.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  if (sLoad || feeLoad) return <Spinner />;
  if (sErr)             return <ErrorBox message={sErr} />;

  if (success) return (
    <PageShell title="Make Payment">
      <div className="flex flex-col items-center py-16 gap-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl">✓</div>
        <h3 className="text-xl font-bold text-green-700">Payment Proof Submitted!</h3>
        <p className="text-slate-500 text-sm text-center max-w-sm">
          Your screenshot has been uploaded and is pending verification by the accounts team.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-2 px-5 py-2 bg-[#0a1a44] text-white rounded-lg text-sm font-semibold hover:bg-[#122b6b] transition"
        >
          Make Another Payment
        </button>
      </div>
    </PageShell>
  );

  // Pull bank details from school
  const bank = school?.bankDetails || {};
  const hasPaymentInfo = bank.upiId || bank.accountNumber || bank.qrUrl;

  return (
    <PageShell title="Make Payment" subtitle="Pay school fees and upload payment proof">
      {/* Outstanding alert */}
      {fee?.outstanding > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-xl">💰</span>
          <div>
            <p className="font-semibold text-amber-800 text-sm">Outstanding: ₹{fee.outstanding.toLocaleString()}</p>
            <p className="text-amber-600 text-xs">Please pay at the earliest.</p>
          </div>
        </div>
      )}

      {/* Fee summary */}
      {fee && (
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Total Fee"   value={`₹${(fee.totalFee   || 0).toLocaleString()}`} colorClass="text-[#0a1a44]" />
          <StatCard label="Paid"        value={`₹${(fee.paid       || 0).toLocaleString()}`} colorClass="text-green-600" />
          <StatCard label="Outstanding" value={`₹${(fee.outstanding|| 0).toLocaleString()}`} colorClass="text-red-600" />
        </div>
      )}

      {/* School payment details — pulled from onboarding BankDetails */}
      <Card>
        <CardTitle>🏦 School Payment Details</CardTitle>
        {hasPaymentInfo ? (
          <div className="flex flex-wrap gap-8 items-start">
            {bank.upiId && (
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase mb-1">UPI ID</p>
                <p className="text-lg font-bold text-[#0a1a44] font-mono">{bank.upiId}</p>
              </div>
            )}
            {bank.accountNumber && (
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Bank Account</p>
                <p className="text-sm text-slate-700">{bank.accountName}</p>
                <p className="text-sm font-mono text-slate-700">{bank.accountNumber}</p>
                {bank.ifsc && <p className="text-xs text-slate-500 mt-0.5">IFSC: {bank.ifsc}</p>}
                {bank.bankName && <p className="text-xs text-slate-500">{bank.bankName}</p>}
              </div>
            )}
            {bank.qrUrl && (
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase mb-1">QR Code</p>
                <img src={bank.qrUrl} alt="QR Code" className="w-28 h-28 rounded-lg border object-cover" />
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-400">Payment details not configured. Please contact school administration.</p>
        )}
      </Card>

      {/* Upload form */}
      <Card>
        <CardTitle>📤 Upload Payment Proof</CardTitle>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm mb-4">{error}</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1.5">Amount Paid (₹)</label>
            <input
              type="number" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1a44]/20 focus:border-[#0a1a44]"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1.5">Payment Mode</label>
            <select
              value={mode} onChange={e => setMode(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0a1a44]/20 focus:border-[#0a1a44]"
            >
              <option value="UPI">UPI</option>
              <option value="BankTransfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-1.5">Payment Screenshot</label>
          <input id="pay-file" type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} className="hidden" />
          <label
            htmlFor="pay-file"
            className={`flex flex-col items-center justify-center gap-2 w-full py-7 border-2 border-dashed rounded-xl cursor-pointer transition
              ${file ? "border-green-300 bg-green-50" : "border-slate-200 bg-slate-50 hover:bg-slate-100"}`}
          >
            <span className="text-2xl">{file ? "🖼️" : "📸"}</span>
            <span className="text-sm font-medium text-slate-600">
              {file ? file.name : "Click to upload payment screenshot"}
            </span>
            <span className="text-xs text-slate-400">PNG, JPG up to 5MB</span>
          </label>
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-5 px-6 py-2.5 bg-[#0a1a44] text-white rounded-lg font-semibold text-sm hover:bg-[#122b6b] transition disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "Submit Payment Proof"}
        </button>
      </Card>
    </PageShell>
  );
}
