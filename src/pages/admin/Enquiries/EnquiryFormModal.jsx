import React, { useEffect, useState } from "react";

export default function EnquiryFormModal({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", courseOrClass: "", enquiryDate: "", followUpDate: "",
    source: "Website", status: "Active", demoTaken: "Not Applicable", category: "Normal",
    city: "", state: "", address: "", remark: ""
  });

  useEffect(() => {
    if (initial) {
      setForm({
        ...initial,
        enquiryDate: initial.enquiryDate
          ? new Date(initial.enquiryDate).toISOString().split("T")[0]
          : "",
        followUpDate: initial.followUpDate
          ? new Date(initial.followUpDate).toISOString().split("T")[0]
          : ""
      });
    } else {
      setForm(f => ({
        ...f,
        enquiryDate: new Date().toISOString().split("T")[0]
      }));
    }
  }, [initial]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!form.name || !form.phone) {
      alert("Please provide at least Name and Phone.");
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
      <div className="bg-white w-[980px] rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex justify-between items-center px-8 py-4 border-b">
          <h3 className="text-xl font-bold text-[#0a1a44]">
            {initial ? "Edit Enquiry" : "Add New Enquiry"}
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

          {/* BASIC DETAILS */}
          <h4 className="section-title">BASIC DETAILS</h4>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Label text="Name *" />
              <input value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="input-style" />
            </div>

            <div>
              <Label text="Email" />
              <input value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="input-style" />
            </div>

            <div>
              <Label text="Phone *" />
              <input value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="input-style" />
            </div>

            <div>
              <Label text="Source" />
              <select value={form.source}
                onChange={e => setForm({ ...form, source: e.target.value })}
                className="input-style">
                <option>Website</option>
                <option>Facebook</option>
                <option>YouTube</option>
                <option>Admin</option>
              </select>
            </div>
          </div>

          {/* ENQUIRY DETAILS */}
          <h4 className="section-title">ENQUIRY DETAILS</h4>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Label text="Enquiry Date" />
              <input type="date" value={form.enquiryDate}
                onChange={e => setForm({ ...form, enquiryDate: e.target.value })}
                className="input-style" />
            </div>

            <div>
              <Label text="Follow Up Date" />
              <input type="date" value={form.followUpDate}
                onChange={e => setForm({ ...form, followUpDate: e.target.value })}
                className="input-style" />
            </div>

            <div>
              <Label text="Status" />
              <select value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                className="input-style">
                <option>Active</option>
                <option>No Action</option>
                <option>Done</option>
              </select>
            </div>

            <div>
              <Label text="Enquiry Category" />
              <select value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="input-style">
                <option>Hot</option>
                <option>Normal</option>
                <option>Cold</option>
              </select>
            </div>
          </div>

          {/* ADDITIONAL INFO */}
          <h4 className="section-title">ADDITIONAL INFO</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label text="City" />
              <input value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                className="input-style" />
            </div>

            <div>
              <Label text="State" />
              <input value={form.state}
                onChange={e => setForm({ ...form, state: e.target.value })}
                className="input-style" />
            </div>

            <div className="col-span-2">
              <Label text="Course / Class" />
              <input value={form.courseOrClass}
                onChange={e => setForm({ ...form, courseOrClass: e.target.value })}
                className="input-style" />
            </div>

            <div className="col-span-2">
              <Label text="Address" />
              <input value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="input-style" />
            </div>

            <div className="col-span-2">
              <Label text="Remark" />
              <textarea rows="3" value={form.remark}
                onChange={e => setForm({ ...form, remark: e.target.value })}
                className="input-style resize-none" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-8 py-4 border-t bg-white">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-[#0a1a44] text-white hover:bg-[#122a6f]">
            {initial ? "Update Enquiry" : "Submit Enquiry"}
          </button>
        </div>

        {/* Styles */}
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
