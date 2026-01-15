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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center pt-20 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[900px] p-6 border border-lightblue-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-navy-700 text-xl font-bold">{initial ? "Edit Visitor" : "Add New Visitor"}</h3>
          <button onClick={onClose} className="text-navy-700 bg-lightblue-50 px-3 py-1 rounded hover:bg-lightblue-100">Close</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input placeholder="Visitor Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="p-2 border border-lightblue-200 rounded" />
          <input placeholder="ID Card No." value={form.idNo} onChange={e => setForm({...form, idNo: e.target.value})} className="p-2 border border-lightblue-200 rounded" />
          <input placeholder="Phone *" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="p-2 border border-lightblue-200 rounded" />
          <input placeholder="Meeting With" value={form.meetingWith} onChange={e => setForm({...form, meetingWith: e.target.value})} className="p-2 border border-lightblue-200 rounded" />

          <input type="number" min="1" placeholder="Total Person" value={form.totalPerson} onChange={e => setForm({...form, totalPerson: Number(e.target.value)})} className="p-2 border border-lightblue-200 rounded" />
          <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="p-2 border border-lightblue-200 rounded" />

          <input type="time" value={form.inTime} onChange={e => setForm({...form, inTime: e.target.value})} className="p-2 border border-lightblue-200 rounded" />
          <input type="time" value={form.outTime} onChange={e => setForm({...form, outTime: e.target.value})} className="p-2 border border-lightblue-200 rounded" />

          <textarea placeholder="Purpose" value={form.purpose} onChange={e => setForm({...form, purpose: e.target.value})} className="p-2 border border-lightblue-200 rounded col-span-2" />
          <input type="text" placeholder="Attachment URL (optional)" value={form.attachment} onChange={e => setForm({...form, attachment: e.target.value})} className="p-2 border border-lightblue-200 rounded col-span-2" />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-lightblue-100 text-navy-700 rounded hover:bg-lightblue-200">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-navy-700 text-white rounded hover:bg-navy-800">{initial ? "Update" : "Submit Now"}</button>
        </div>
      </div>
    </div>
  );
}
