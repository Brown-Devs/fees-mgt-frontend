import React, { useEffect, useState } from "react";

export default function VisitorFormModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState({
    name: "", idNo: "", phone: "", meetingWith: "", totalPerson: 1,
    date: "", inTime: "", outTime: "", purpose: "", attachment: ""
  });

  useEffect(() => {
    if (initial) {
      setForm({
        ...initial,
        date: initial.date ? new Date(initial.date).toISOString().split("T")[0] : "",
      });
    } else {
      setForm(f => ({ ...f, date: new Date().toISOString().split("T")[0] }));
    }
  }, [initial]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!form.name || !form.phone) {
      alert("Please provide Name and Phone.");
      return;
    }
    onSave(form);
  };

  const Label = ({ text }) => (
    <label className="text-xs font-semibold text-gray-600 mb-1 block">
      {text}
    </label>
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-start justify-center pt-10 z-50">
      <div className="bg-white w-[900px] rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center px-8 py-4 border-b">
          <h3 className="text-xl font-bold text-[#0a1a44]">
            {initial ? "Edit Visitor" : "Add New Visitor"}
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

          <h4 className="section-title">VISITOR DETAILS</h4>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Label text="Visitor Name *" />
              <input value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="input-style" />
            </div>

            <div>
              <Label text="ID Card No." />
              <input value={form.idNo}
                onChange={e => setForm({ ...form, idNo: e.target.value })}
                className="input-style" />
            </div>

            <div>
              <Label text="Phone *" />
              <input value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="input-style" />
            </div>

            <div>
              <Label text="Meeting With" />
              <input value={form.meetingWith}
                onChange={e => setForm({ ...form, meetingWith: e.target.value })}
                className="input-style" />
            </div>

            <div>
              <Label text="Total Persons" />
              <input type="number" min="1" value={form.totalPerson}
                onChange={e => setForm({ ...form, totalPerson: Number(e.target.value) })}
                className="input-style" />
            </div>

            <div>
              <Label text="Visit Date" />
              <input type="date" value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="input-style" />
            </div>

            <div>
              <Label text="In Time" />
              <input type="time" value={form.inTime}
                onChange={e => setForm({ ...form, inTime: e.target.value })}
                className="input-style" />
            </div>

            <div>
              <Label text="Out Time" />
              <input type="time" value={form.outTime}
                onChange={e => setForm({ ...form, outTime: e.target.value })}
                className="input-style" />
            </div>
          </div>

          <h4 className="section-title">PURPOSE & ATTACHMENT</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label text="Purpose" />
              <textarea rows="3" value={form.purpose}
                onChange={e => setForm({ ...form, purpose: e.target.value })}
                className="input-style resize-none" />
            </div>

            <div className="col-span-2">
              <Label text="Attachment URL (optional)" />
              <input value={form.attachment}
                onChange={e => setForm({ ...form, attachment: e.target.value })}
                className="input-style" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-8 py-4 border-t bg-white">
          <button onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
            Cancel
          </button>
          <button onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-[#0a1a44] text-white hover:bg-[#122a6f]">
            {initial ? "Update Visitor" : "Submit Visitor"}
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
