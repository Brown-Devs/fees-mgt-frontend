import React, { useState, useEffect } from "react";
import api from "../../../apis/axios";

const AttendancePage = () => {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [section, setSection] = useState("");
  const [stream, setStream] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  // fetch classes
  useEffect(() => {
    api.get("/api/classes")
      .then(res => setClasses(res.data.data))
      .catch(err => console.error("Failed to load classes:", err));
  }, []);

  // auto-fill section/stream when class selected
  useEffect(() => {
    if (classId) {
      const selectedClass = classes.find(c => c._id === classId);
      if (selectedClass) {
        setSection(selectedClass.section);
        setStream(selectedClass.stream);
      }
    } else {
      setSection("");
      setStream("");
    }
  }, [classId, classes]);

  // fetch students
  useEffect(() => {
    if (classId && section && stream) {
      api.get(`/api/students?classId=${classId}&section=${section}&stream=${stream}`)
        .then(res => {
          setStudents(res.data.data);
          // initialize attendance state
          const init = {};
          res.data.data.forEach(s => { init[s._id] = ""; });
          setAttendance(init);
        });
    }
  }, [classId, section, stream]);

  const toggleStatus = (studentId, status) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = async () => {
    const today = new Date().toISOString().split("T")[0];
    if (date !== today) return alert("Cannot save past attendance");

    const payload = Object.entries(attendance).map(([studentId, status]) => ({
      studentId, classId, section, stream, date, status
    }));

    await api.post("/api/attendance/save", { records: payload });
    alert("Attendance saved successfully!");
  };

  // validation: check if all students have a status
  const allMarked = students.length > 0 && students.every(s => attendance[s._id] !== "");

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-[#0a1a44]">Attendance</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select value={classId} onChange={e => setClassId(e.target.value)} className="border p-2">
          <option value="">Select Class</option>
          {classes.map(c => (
            <option key={c._id} value={c._id}>
              {c.name} ({c.section} - {c.stream})
            </option>
          ))}
        </select>
        <input type="text" value={section} readOnly className="border p-2 bg-gray-100" />
        <input type="text" value={stream} readOnly className="border p-2 bg-gray-100" />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-2" />
      </div>

      {/* Student Table */}
      <table className="w-full border border-gray-300 rounded-lg shadow-sm">
  <thead className="sticky top-0 bg-[#0a1a44] text-white">
    <tr>
      <th className="p-3 text-left">Roll No</th>
      <th className="p-3 text-left">Name</th>
      <th className="p-3 text-left">Father Name</th>
      <th className="p-3 text-center">Present</th>
      <th className="p-3 text-center">Absent</th>
    </tr>
  </thead>
  <tbody>
    {students.map((s, idx) => (
      <tr
        key={s._id}
        className={`border-t ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50`}
      >
        <td className="p-3">{s.rollNo}</td>
        <td className="p-3">{`${s.firstName} ${s.lastName || ""}`}</td>
        <td className="p-3">{s.fatherName}</td>
        <td className="p-3 text-center">
          <button
            onClick={() => toggleStatus(s._id, "Present")}
            className={`px-4 py-1 rounded-full font-semibold transition ${
              attendance[s._id] === "Present"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-green-100"
            }`}
          >
            ✓ Present
          </button>
        </td>
        <td className="p-3 text-center">
          <button
            onClick={() => toggleStatus(s._id, "Absent")}
            className={`px-4 py-1 rounded-full font-semibold transition ${
              attendance[s._id] === "Absent"
                ? "bg-red-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-red-100"
            }`}
          >
            ✗ Absent
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>


      {/* Save button */}
      <div className="flex justify-between items-center mt-6 p-4 bg-gray-100 rounded-lg">
  <div className="flex gap-6">
    <span className="font-semibold text-green-600">
      Present: {Object.values(attendance).filter(v => v === "Present").length}
    </span>
    <span className="font-semibold text-red-600">
      Absent: {Object.values(attendance).filter(v => v === "Absent").length}
    </span>
  </div>
  <button
    onClick={saveAttendance}
    disabled={!allMarked}
    className={`px-6 py-2 rounded-lg font-bold transition ${
      allMarked
        ? "bg-[#0a1a44] text-white hover:bg-[#132b6b]"
        : "bg-gray-400 text-gray-200 cursor-not-allowed"
    }`}
  >
    Save Attendance
  </button>
</div>

    </div>
  );
};

export default AttendancePage;
