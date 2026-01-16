import React, { useEffect, useState } from "react";

export default function IncomeFormModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    amount: "",
    paymentMode: "Cash",
    paymentStatus: "Full",
    receiptNumber: "",
    collectorName: "",
    collectorRole: "",
    incomeType: "Fee",
    dueDate: ""
  });

  useEffect(() => {
    if (initial) {
      setForm({
        ...initial,
        amount: initial.amount ?? "",
        dueDate: initial.dueDate
          ? new Date(initial.dueDate).toISOString().split("T")[0]
          : ""
      });
    } else {
      setForm(f => ({ ...f, dueDate: "" }));
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
      <div className="bg-white w-[820px] rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center px-8 py-4 border-b">
          <h3 className="text-xl font-bold text-[#0a1a44]">
            {initial ? "Edit Income" : "Create Income"}
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

          <h4 className="section-title">INCOME DETAILS</h4>
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
              <Label text="Payment Mode" />
              <select
                value={form.paymentMode}
                onChange={e => setForm({ ...form, paymentMode: e.target.value })}
                className="input-style"
              >
                <option>Cash</option>
                <option>Card</option>
                <option>Bank Transfer</option>
                <option>UPI</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <Label text="Payment Status" />
              <select
                value={form.paymentStatus}
                onChange={e => setForm({ ...form, paymentStatus: e.target.value })}
                className="input-style"
              >
                <option>Full</option>
                <option>Partial</option>
              </select>
            </div>

            <div>
              <Label text="Receipt Number" />
              <input
                value={form.receiptNumber}
                onChange={e => setForm({ ...form, receiptNumber: e.target.value })}
                className="input-style"
              />
            </div>

            <div>
              <Label text="Income Type" />
              <select
                value={form.incomeType}
                onChange={e => setForm({ ...form, incomeType: e.target.value })}
                className="input-style"
              >
                <option>Fee</option>
                <option>Non Fee</option>
              </select>
            </div>
          </div>

          <h4 className="section-title">COLLECTION DETAILS</h4>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Label text="Collector Name" />
              <input
                value={form.collectorName}
                onChange={e => setForm({ ...form, collectorName: e.target.value })}
                className="input-style"
              />
            </div>

            <div>
              <Label text="Collector Role" />
              <input
                value={form.collectorRole}
                onChange={e => setForm({ ...form, collectorRole: e.target.value })}
                className="input-style"
              />
            </div>

            <div>
              <Label text="Due Date" />
              <input
                type="date"
                value={form.dueDate}
                onChange={e => setForm({ ...form, dueDate: e.target.value })}
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
            {initial ? "Update Income" : "Create Income"}
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
