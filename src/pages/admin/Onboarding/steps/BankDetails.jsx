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
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Bank Details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

      <div className="pt-4">
        <button
          onClick={saveBankDetails}
          disabled={saving}
          className="bg-black text-white px-6 py-2 rounded disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Bank Details"}
        </button>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm text-slate-600">{label}</label>
      <input
        {...props}
        className="w-full border px-3 py-2 rounded text-sm"
      />
    </div>
  );
}
