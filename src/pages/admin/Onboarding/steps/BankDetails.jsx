import { useState } from "react";
import api from "../../../../apis/axios";

export default function BankDetails({ school }) {
  const [form, setForm] = useState({
    bankName: school.bankDetails?.bankName || "",
    accountName: school.bankDetails?.accountName || "",
    accountNumber: school.bankDetails?.accountNumber || "",
    ifsc: school.bankDetails?.ifsc || "",
  });

  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function saveBankDetails() {
    setSaving(true);
    try {
      await api.put(`/api/schools/${school._id}/settings`, {
        bankDetails: form,
      });
      alert("Bank details saved successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to save bank details");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Bank Details
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Used for fee collection, refunds, and settlements
          </p>
        </div>

        <span className="text-xs px-3 py-1 rounded-full
                         bg-[#0b1f3a]/10 text-[#0b1f3a] font-medium">
          Step 3 of 5
        </span>
      </div>

      {/* Premium Card */}
      <div className="bg-white rounded-2xl
                      shadow-[0_14px_36px_rgba(0,0,0,0.08)]
                      border border-slate-200 overflow-hidden">

        {/* Accent bar */}
        <div className="h-1 bg-gradient-to-r
                        from-[#0b1f3a] to-[#162e52]" />

        <div className="p-8 space-y-10">

          {/* Section */}
          <div>
            <h3 className="text-sm font-semibold text-[#0b1f3a]
                           uppercase tracking-wide mb-6">
              Bank Account Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                label="Bank Name"
                name="bankName"
                value={form.bankName}
                onChange={handleChange}
              />

              <Input
                label="Account Holder Name"
                name="accountName"
                value={form.accountName}
                onChange={handleChange}
              />

              <Input
                label="Account Number"
                name="accountNumber"
                value={form.accountNumber}
                onChange={handleChange}
              />

              <Input
                label="IFSC Code"
                name="ifsc"
                value={form.ifsc}
                onChange={handleChange}
              />
            </div>

            {/* Security hint */}
            {/* <p className="text-xs text-slate-400 mt-4">
              🔒 Your bank information is encrypted and securely stored.
            </p> */}
          </div>

          {/* Save */}
          <div className="pt-2">
            <button
              onClick={saveBankDetails}
              disabled={saving}
              className="px-6 py-2.5 rounded-lg font-medium
                         bg-[#0b1f3a] text-white
                         hover:bg-[#091a30] transition
                         disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Bank Details"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ================= INPUT ================= */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-xs text-slate-500 mb-1 block">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-4 py-3 rounded-xl
                   border border-slate-200 bg-slate-50 text-sm
                   focus:ring-2 focus:ring-[#0b1f3a]
                   focus:border-[#0b1f3a]
                   outline-none transition"
      />
    </div>
  );
}
