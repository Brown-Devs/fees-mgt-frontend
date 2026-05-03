// src/pages/admin/Onboarding/steps/BankDetails.jsx
// QR is stored as base64 directly — no separate upload endpoint needed
import { useState } from "react";
import api from "../../../../apis/axios";

export default function BankDetails({ school }) {
  const [form, setForm] = useState({
    bankName:      school.bankDetails?.bankName      || "",
    accountName:   school.bankDetails?.accountName   || "",
    accountNumber: school.bankDetails?.accountNumber || "",
    ifsc:          school.bankDetails?.ifsc          || "",
    upiId:         school.bankDetails?.upiId         || "",
  });

  // QR — stored as base64 string in DB, no separate upload API needed
  const [qrBase64, setQrBase64] = useState(school.bankDetails?.qrUrl || "");
  const [saving, setSaving] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleQrChange = e => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (max 500KB for base64 storage)
    if (file.size > 500 * 1024) {
      alert("QR image must be under 500KB. Please compress or crop it.");
      return;
    }

    const reader = new FileReader();
    reader.onload = ev => setQrBase64(ev.target.result); // data:image/...;base64,...
    reader.readAsDataURL(file);
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.put(`/api/schools/${school._id}/settings`, {
        bankDetails: {
          ...form,
          qrUrl: qrBase64, // base64 saved directly — no upload endpoint needed
        },
      });
      alert("Bank details saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save: " + (err?.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Bank Details</h2>
          <p className="text-sm text-slate-500 mt-1">
            Parents will see these payment details when making fee payments
          </p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-[#0b1f3a]/10 text-[#0b1f3a] font-medium">
          Step 3 of 6
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_14px_36px_rgba(0,0,0,0.08)] border border-slate-200 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-[#0b1f3a] to-[#162e52]" />
        <div className="p-8 space-y-10">

          {/* Bank Account */}
          <div>
            <h3 className="text-sm font-semibold text-[#0b1f3a] uppercase tracking-wide mb-6">
              Bank Account
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input label="Bank Name"           name="bankName"      value={form.bankName}      onChange={handleChange} />
              <Input label="Account Holder Name" name="accountName"   value={form.accountName}   onChange={handleChange} />
              <Input label="Account Number"      name="accountNumber" value={form.accountNumber} onChange={handleChange} />
              <Input label="IFSC Code"           name="ifsc"          value={form.ifsc}          onChange={handleChange} />
            </div>
          </div>

          {/* UPI + QR */}
          <div>
            <h3 className="text-sm font-semibold text-[#0b1f3a] uppercase tracking-wide mb-6">
              UPI & QR Code
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="UPI ID (e.g. school@upi)"
                name="upiId"
                value={form.upiId}
                onChange={handleChange}
                placeholder="yourschool@icici"
              />

              {/* QR Upload — stored as base64, no server upload needed */}
              <div>
                <label className="text-xs text-slate-500 mb-1 block">
                  QR Code Image <span className="text-slate-400">(max 500KB)</span>
                </label>

                {qrBase64 ? (
                  <div className="flex flex-col items-start gap-2">
                    <img
                      src={qrBase64}
                      alt="QR Code"
                      className="h-36 w-36 object-contain rounded-xl border border-slate-200"
                    />
                    <div className="flex gap-3">
                      <label
                        htmlFor="qr-upload"
                        className="text-xs text-[#0a1a44] underline cursor-pointer"
                      >
                        Change QR
                      </label>
                      <button
                        onClick={() => setQrBase64("")}
                        className="text-xs text-red-500 underline"
                      >
                        Remove QR
                      </button>
                    </div>
                    <input id="qr-upload" type="file" accept="image/*" onChange={handleQrChange} className="hidden" />
                  </div>
                ) : (
                  <>
                    <input id="qr-upload" type="file" accept="image/*" onChange={handleQrChange} className="hidden" />
                    <label
                      htmlFor="qr-upload"
                      className="flex flex-col items-center justify-center gap-2 w-full py-6 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition"
                    >
                      <span className="text-3xl">📷</span>
                      <span className="text-sm text-slate-500">Click to upload QR code</span>
                      <span className="text-xs text-slate-400">PNG or JPG, max 500KB</span>
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="px-6 py-2.5 rounded-lg font-medium bg-[#0b1f3a] text-white hover:bg-[#091a30] transition disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Bank Details"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-xs text-slate-500 mb-1 block">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-[#0b1f3a] focus:border-[#0b1f3a] outline-none transition"
      />
    </div>
  );
}
