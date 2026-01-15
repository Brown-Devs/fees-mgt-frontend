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

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Make Payment (Admin/Accountant)</h2>

      <div className="flex gap-4 items-center">
        <select
          className="border p-2 rounded"
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

        <select
          className="border p-2 rounded"
          value={selectedStudent}
          onChange={e => setSelectedStudent(e.target.value)}
          disabled={!classId}
        >
          <option value="">Select student</option>
          {students.map(s => (
            <option key={s._id} value={s._id}>
              {s.rollNo} - {s.firstName} {s.lastName}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-gray-50 p-4 rounded space-y-3">
        <input
          type="number"
          className="border p-2 rounded w-48"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <select
          className="border p-2 rounded w-48"
          value={mode}
          onChange={e => setMode(e.target.value)}
        >
          <option value="Cash">Cash</option>
          <option value="BankTransfer">Bank Transfer</option>
          <option value="UPI">UPI</option>
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={e => setFile(e.target.files[0])}
        />

        <button
          onClick={submitManualPayment}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Record Payment
        </button>
      </div>
    </div>
  );
};

export default AdminMakePaymentPage;
