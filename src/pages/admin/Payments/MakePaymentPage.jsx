import React, { useEffect, useState } from "react";
import api from "../../../apis/axios";

const AdminMakePaymentPage = () => {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [section, setSection] = useState("");
  const [stream, setStream] = useState("");
  const [students, setStudents] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState("");
  const [feeStructureId, setFeeStructureId] = useState("");
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("Cash");
  const [file, setFile] = useState(null);

  // Fetch classes
  useEffect(() => {
    api.get("/api/classes")
      .then(res => setClasses(res.data.data))
      .catch(err => console.error("Failed to load classes:", err));
  }, []);

  // Auto-fill section & stream
  useEffect(() => {
    if (!classId) {
      setSection("");
      setStream("");
      return;
    }
    const selectedClass = classes.find(c => c._id === classId);
    if (selectedClass) {
      setSection(selectedClass.section);
      setStream(selectedClass.stream);
    }
  }, [classId, classes]);

  // Fetch students when class changes
  useEffect(() => {
    if (!classId || !section || !stream) return;
    api.get(`/api/students?classId=${classId}&section=${section}&stream=${stream}`)
      .then(res => setStudents(res.data.data))
      .catch(err => console.error("Failed to load students:", err));
  }, [classId, section, stream]);

  // Fetch fee details when student selected
  useEffect(() => {
    if (!selectedStudent) return;
    api.get(`/api/fees/student/${selectedStudent}`)
      .then(res => {
        const d = res.data.data;
        setFeeStructureId(d.feeStructureId);
        setAmount(d.outstanding || d.totalFee || "");
      })
      .catch(console.error);
  }, [selectedStudent]);

  const submitManualPayment = async () => {
    if (!selectedStudent || !classId || !feeStructureId || !amount) {
      return alert("Please fill all required fields");
    }

    const formData = new FormData();
    formData.append("studentId", selectedStudent);
    formData.append("classId", classId);
    formData.append("feeStructureId", feeStructureId);
    formData.append("amount", Number(amount));
    formData.append("mode", mode);
    if (file) formData.append("screenshot", file);

    try {
      await api.post("/api/payments/admin-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Payment recorded and verified.");
    } catch (err) {
      console.error(err);
      alert("Failed to record payment");
    }
  };

  const Label = ({ text }) => (
    <label className="text-xs font-semibold text-gray-600 mb-1 block">
      {text}
    </label>
  );

  return (
    <div className="p-6 bg-[#f5f7fb] min-h-screen">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#0a1a44]">
          Make Payment
        </h2>
        <p className="text-sm text-gray-500">
          Record manual fee payments for students (Admin / Accountant)
        </p>
      </div>

      {/* Selection Section */}
      <div className="bg-white rounded-xl shadow p-6 mb-6 max-w-3xl">
        <h4 className="section-title">STUDENT SELECTION</h4>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label text="Class" />
            <select
              className="input-style"
              value={classId}
              onChange={e => setClassId(e.target.value)}
            >
              <option value="">Select Class</option>
              {classes.map(c => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.section} - {c.stream})
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label text="Student" />
            <select
              className="input-style"
              value={selectedStudent}
              onChange={e => setSelectedStudent(e.target.value)}
              disabled={!classId}
            >
              <option value="">Select Student</option>
              {students.map(s => (
                <option key={s._id} value={s._id}>
                  {s.rollNo} - {s.firstName} {s.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-white rounded-xl shadow p-6 max-w-3xl">
        <h4 className="section-title">PAYMENT DETAILS</h4>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label text="Amount" />
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="input-style"
            />
          </div>

          <div>
            <Label text="Payment Mode" />
            <select
              value={mode}
              onChange={e => setMode(e.target.value)}
              className="input-style"
            >
              <option value="Cash">Cash</option>
              <option value="BankTransfer">Bank Transfer</option>
              <option value="UPI">UPI</option>
            </select>
          </div>

          <div className="col-span-2">
            <Label text="Payment Proof (optional)" />
            <input
              type="file"
              accept="image/*"
              onChange={e => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-600
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:bg-[#eef1fb] file:text-[#0a1a44]
                hover:file:bg-[#e0e6ff]"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={submitManualPayment}
            className="px-6 py-2 bg-[#0a1a44] text-white rounded-lg hover:bg-[#122a6f]"
          >
            Record Payment
          </button>
        </div>
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
          margin-bottom: 1rem;
          letter-spacing: 0.04em;
        }
      `}</style>
    </div>
  );
};

export default AdminMakePaymentPage;
