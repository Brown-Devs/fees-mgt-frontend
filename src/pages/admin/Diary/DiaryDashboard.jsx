import React, { useState, useEffect } from "react";
import api from "../../../apis/axios";
import PageHeader from "../../../components/common/PageHeader";

const DiaryDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [section, setSection] = useState("");
  const [stream, setStream] = useState("");

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");

  const [mode, setMode] = useState("single");

  const [subject, setSubject] = useState("");
  const [homework, setHomework] = useState("");
  const [notice, setNotice] = useState("");
  const [remarks, setRemarks] = useState("");
  const [feedback, setFeedback] = useState("");

  /* ---------------- Fetch ---------------- */
  useEffect(() => {
    api.get("/api/classes").then(res => setClasses(res.data.data || []));
  }, []);

  useEffect(() => {
    const selected = classes.find(c => c._id === classId);
    if (selected) {
      setSection(selected.section);
      setStream(selected.stream);
    }
  }, [classId, classes]);

  useEffect(() => {
    if (!classId || !section || !stream) return;

    api.get(`/api/students?classId=${classId}&section=${section}&stream=${stream}`)
      .then(res => setStudents(res.data.data || []));
  }, [classId, section, stream]);

  /* ---------------- Save ---------------- */
  const saveDiary = async () => {
    if (!classId) return alert("Select class");

    if (mode === "single") {
      if (!selectedStudent) return alert("Select student");

      await api.post("/api/diary", {
        classId,
        studentId: selectedStudent,
        subject,
        homework,
        notice,
        remarks,
        feedback
      });
    } else {
      await api.post("/api/diary/bulk", {
        classId,
        subject,
        homework,
        notice,
        remarks,
        feedback,
        students
      });
    }

    alert("Diary entry saved!");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <PageHeader title="School Diary" subtitle="Homework, notices & feedback" />

      <div className="bg-white rounded-2xl shadow p-6">

        {/* Class Selection */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Select Class</label>
          <select
            className="input mt-1"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          >
            <option value="">Select Class</option>
            {classes.map(c => (
              <option key={c._id} value={c._id}>
                {c.name} ({c.section} - {c.stream})
              </option>
            ))}
          </select>

          {classId && (
            <p className="text-sm mt-2 text-gray-500">
              Section: <b>{section}</b> | Stream: <b>{stream}</b>
            </p>
          )}
        </div>

        {/* Mode */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setMode("single")}
            className={`px-4 py-2 rounded-lg border ${
              mode === "single"
                ? "bg-[#0b1f3a] text-white"
                : "bg-gray-100"
            }`}
          >
            Single Student
          </button>

          <button
            onClick={() => setMode("bulk")}
            className={`px-4 py-2 rounded-lg border ${
              mode === "bulk"
                ? "bg-[#0b1f3a] text-white"
                : "bg-gray-100"
            }`}
          >
            Whole Class
          </button>
        </div>

        {/* Student Dropdown */}
        {mode === "single" && (
          <div className="mb-4">
            <label className="text-sm text-gray-600">Select Student</label>
            <select
              className="input mt-1 bg-white text-black"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              <option value="">Select Student</option>
              {students.map(s => (
                <option key={s._id} value={s._id}>
                  {s.firstName} {s.lastName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Subject */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Subject</label>
          <input
            className="input mt-1"
            placeholder="e.g. Maths"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        {/* Homework */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Homework</label>
          <textarea
            className="input mt-1 h-24"
            placeholder="Enter homework..."
            value={homework}
            onChange={(e) => setHomework(e.target.value)}
          />
        </div>

        {/* Notice */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Notice</label>
          <textarea
            className="input mt-1 h-24"
            placeholder="Enter notice..."
            value={notice}
            onChange={(e) => setNotice(e.target.value)}
          />
        </div>

        {/* Remarks */}
        <div className="mb-4">
          <label className="text-sm text-gray-600">Remarks</label>
          <textarea
            className="input mt-1 h-20"
            placeholder="Enter remarks..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>

        {/* Feedback */}
        <div className="mb-6">
          <label className="text-sm text-gray-600">Feedback</label>
          <textarea
            className="input mt-1 h-20"
            placeholder="Enter feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>

        {/* Save */}
        <div className="text-right">
          <button onClick={saveDiary} className="btn-primary">
            Save Diary Entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiaryDashboard;