import React, { useEffect, useState } from "react";

export default function ExpenseFormModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    amount: "",
    personName: "",
    invoiceUrl: "",
    date: ""
  });

  useEffect(() => {
    if (initial) {
      setForm({
        ...initial,
        amount: initial.amount ?? "",
        date: initial.date
          ? new Date(initial.date).toISOString().split("T")[0]
          : ""
      });
    } else {
      setForm(f => ({
        ...f,
        date: new Date().toISOString().split("T")[0]
      }));
    }
  }, [initial]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!form.title || !form.amount) {
      alert("Please provide Title and Amount.");
      return;
    }
    onSave({ ...form, amount: Number(form.amount) });
  };

  const Label = ({ text }) => (
    <label className="text-xs font-semibold text-gray-600 mb-1 block">
      {text}
    </label>
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-start justify-center pt-10 z-50">
      <div className="bg-white w-[760px] rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center px-8 py-4 border-b">
          <h3 className="text-xl font-bold text-[#0a1a44]">
            {initial ? "Edit Expense" : "Create Expense"}
          </h3>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-[#eef1fb] text-[#0a1a44] hover:bg-[#e0e6ff]"
          >
            Close
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="px-8 py-6 overflow-y-auto">

          <h4 className="section-title">EXPENSE DETAILS</h4>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Label text="Title *" />
              <input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="input-style"
              />
            </div>

            <div>
              <Label text="Amount *" />
              <input
                type="number"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                className="input-style"
              />
            </div>

            <div>
              <Label text="Person / Vendor Name" />
              <input
                value={form.personName}
                onChange={e => setForm({ ...form, personName: e.target.value })}
                className="input-style"
              />
            </div>

            <div>
              <Label text="Invoice URL (optional)" />
              <input
                value={form.invoiceUrl}
                onChange={e => setForm({ ...form, invoiceUrl: e.target.value })}
                className="input-style"
              />
            </div>

            <div>
              <Label text="Expense Date" />
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="input-style"
              />
            </div>
          </div>

          <h4 className="section-title">DESCRIPTION</h4>
          <div>
            <Label text="Description" />
            <textarea
              rows="3"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="input-style resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-8 py-4 border-t bg-white">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-[#0a1a44] text-white hover:bg-[#122a6f]"
          >
            {initial ? "Update Expense" : "Create Expense"}
          </button>
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
          .section-title {
            font-size: 0.75rem;
            font-weight: 600;
            color: #6b7280;
            margin-bottom: 0.75rem;
            letter-spacing: 0.04em;
          }
        `}</style>
      </div>
    </div>
  );
}
