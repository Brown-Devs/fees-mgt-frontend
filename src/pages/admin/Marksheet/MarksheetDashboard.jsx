import React, { useState, useEffect } from "react";
import api from "../../../apis/axios";
import PageHeader from "../../../components/common/PageHeader";
import SingleEntry from "./SingleEntry";
import BulkEntry from "./BulkEntry";
import ViewMarksheets from "./ViewMarksheets";

const steps = ["Exam Setup", "Subjects", "Mode", "Entry"];

const MarksheetDashboard = () => {
  const [step, setStep]               = useState(1);
  const [activeTab, setActiveTab]     = useState("create");

  const [examTypes, setExamTypes]     = useState([]);
  const [examTypeId, setExamTypeId]   = useState("");
  const [newExamType, setNewExamType] = useState("");
  const [showModal, setShowModal]     = useState(false);
  const [modalErr, setModalErr]       = useState("");

  const [classes, setClasses]         = useState([]);
  const [classId, setClassId]         = useState("");
  const [section, setSection]         = useState("");
  const [stream, setStream]           = useState("");

  const [students, setStudents]       = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");

  const [subjects, setSubjects]       = useState([{ name: "", fullMarks: "" }]);
  const [mode, setMode]               = useState("single");

  useEffect(() => {
    api.get("/api/exam-types").then(res => setExamTypes(res.data.data || []));
    api.get("/api/classes").then(res => setClasses(res.data.data || []));
  }, []);

  useEffect(() => {
    const selected = classes.find(c => c._id === classId);
    if (selected) { setSection(selected.section); setStream(selected.stream); }
    else          { setSection(""); setStream(""); }
    setSelectedStudent("");
    setStudents([]);
  }, [classId, classes]);

  useEffect(() => {
    if (!classId || !section || !stream) return;
    api.get(`/api/students?classId=${classId}&section=${section}&stream=${stream}`)
      .then(res => setStudents(res.data.data || []));
  }, [classId, section, stream]);

  const createExam = async () => {
    if (!newExamType.trim()) return setModalErr("Name is required");
    try {
      const res = await api.post("/api/exam-types", { name: newExamType.trim() });
      setExamTypes(prev => [res.data.data, ...prev]);
      setExamTypeId(res.data.data._id);
      setNewExamType("");
      setShowModal(false);
      setModalErr("");
    } catch (err) {
      setModalErr(err.response?.data?.message || "Failed to create");
    }
  };

  const addSubject    = () => setSubjects([...subjects, { name: "", fullMarks: "" }]);
  const removeSubject = (i) => setSubjects(subjects.filter((_, idx) => idx !== i));
  const updateSubject = (i, field, value) => {
    const copy = [...subjects];
    copy[i][field] = value;
    setSubjects(copy);
  };

  const canNext = () => {
    if (step === 1) return examTypeId && classId;
    if (step === 2) return subjects.length > 0 && subjects.every(s => s.name.trim() && s.fullMarks);
    return true;
  };

  const resetFlow = () => {
    setStep(1); setExamTypeId(""); setClassId("");
    setSection(""); setStream(""); setStudents([]);
    setSelectedStudent(""); setSubjects([{ name: "", fullMarks: "" }]);
    setMode("single");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">

      {/* ── Header ── */}
      <PageHeader title="Marksheet" subtitle="Manage student marks" />

      {/* ── Tabs — with top margin to separate from header ── */}
      <div className="flex gap-3 mt-2 mb-8">
        {[
          { key: "create", label: "➕ Create / Edit Marks" },
          { key: "view",   label: "📋 View Marksheets"    }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-lg font-medium transition text-sm ${
              activeTab === tab.key
                ? "bg-[#0b1f3a] text-white shadow"
                : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── VIEW TAB ── */}
      {activeTab === "view" && (
        <ViewMarksheets examTypes={examTypes} classes={classes} />
      )}

      {/* ── CREATE TAB ── */}
      {activeTab === "create" && (
        <>
          {/* Stepper */}
          <div className="flex items-center justify-between mb-6 px-2">
            {steps.map((s, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-colors
                    ${step >= i + 1
                      ? "bg-[#0b1f3a] text-white"
                      : "bg-gray-200 text-gray-500"}`}>
                    {i + 1}
                  </div>
                  <p className="text-xs mt-1 text-gray-500 whitespace-nowrap">{s}</p>
                </div>
                {/* connector line between steps */}
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mb-4 ${step > i + 1 ? "bg-[#0b1f3a]" : "bg-gray-200"}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow p-6">

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <>
                <h3 className="font-semibold text-gray-800 mb-4">Exam & Class</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                    <div className="flex gap-2">
                      <select className="input flex-1" value={examTypeId}
                        onChange={e => setExamTypeId(e.target.value)}>
                        <option value="">Select Exam</option>
                        {examTypes.map(et => (
                          <option key={et._id} value={et._id}>{et.name}</option>
                        ))}
                      </select>
                      <button onClick={() => setShowModal(true)}
                        className="btn-primary w-10 flex items-center justify-center text-xl" title="New exam type">
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                    <select className="input" value={classId}
                      onChange={e => setClassId(e.target.value)}>
                      <option value="">Select Class</option>
                      {classes.map(c => (
                        <option key={c._id} value={c._id}>
                          {c.name} ({c.section} – {c.stream})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {classId && (
                  <p className="mt-3 text-sm text-gray-500">
                    Section: <strong className="text-gray-800">{section}</strong>
                    &nbsp;|&nbsp;
                    Stream: <strong className="text-gray-800">{stream}</strong>
                  </p>
                )}
              </>
            )}

           {/* ── STEP 2 ── */}
{step === 2 && (
  <>
    <h3 className="font-semibold text-gray-800 mb-4">Subjects & Full Marks</h3>

    {/* Column headers */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 32px", gap: "12px" }}
      className="mb-2 px-1">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Subject Name</p>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Full Marks</p>
      <div />
    </div>

    {subjects.map((s, i) => (
      <div
        key={i}
        style={{ display: "grid", gridTemplateColumns: "1fr 160px 32px", gap: "12px" }}
        className="mb-3 items-center"
      >
        <input
          style={{ width: "100%", boxSizing: "border-box" }}
          className="input"
          placeholder="e.g. Mathematics"
          value={s.name}
          onChange={e => updateSubject(i, "name", e.target.value)}
        />
        <input
          style={{ width: "100%", boxSizing: "border-box" }}
          className="input"
          type="number"
          placeholder="e.g. 100"
          min={1}
          value={s.fullMarks}
          onChange={e => updateSubject(i, "fullMarks", e.target.value)}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          {subjects.length > 1 ? (
            <button
              onClick={() => removeSubject(i)}
              style={{
                width: "28px", height: "28px", borderRadius: "50%",
                border: "none", background: "transparent",
                color: "#ef4444", fontSize: "20px", fontWeight: "bold",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
              }}
              title="Remove"
            >
              ×
            </button>
          ) : <div />}
        </div>
      </div>
    ))}

    <button onClick={addSubject} className="mt-1 btn-outline text-sm">
      + Add Subject
    </button>
  </>
)}

            {/* ── STEP 3 ── */}
            {step === 3 && (
              <>
                <h3 className="font-semibold text-gray-800 mb-4">Entry Mode</h3>
                <div className="flex gap-4">
                  {[
                    { key: "single", label: "👤 Single Entry", desc: "Enter marks one student at a time" },
                    { key: "bulk",   label: "👥 Bulk Entry",   desc: "Enter marks for all students in a table" }
                  ].map(m => (
                    <button key={m.key} onClick={() => setMode(m.key)}
                      className={`flex-1 max-w-xs text-left px-5 py-4 rounded-xl border-2 transition ${
                        mode === m.key
                          ? "border-[#0b1f3a] bg-[#0b1f3a] text-white"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                      }`}>
                      <p className="font-semibold">{m.label}</p>
                      <p className={`text-xs mt-1 ${mode === m.key ? "text-blue-200" : "text-gray-400"}`}>
                        {m.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* ── STEP 4 ── */}
            {step === 4 && (
              <>
                <h3 className="font-semibold text-gray-800 mb-4">Enter Marks</h3>

                {mode === "single" && (
                  <>
                    <select className="input mb-4" value={selectedStudent}
                      onChange={e => setSelectedStudent(e.target.value)}>
                      <option value="">Select Student</option>
                      {students.map(s => (
                        <option key={s._id} value={s._id}>
                          {s.rollNo} – {s.firstName} {s.lastName}
                        </option>
                      ))}
                    </select>

                    {selectedStudent && (
                      <SingleEntry
                        key={selectedStudent}
                        examTypeId={examTypeId}
                        classId={classId}
                        student={students.find(s => s._id === selectedStudent)}
                        subjects={subjects}
                      />
                    )}
                  </>
                )}

                {mode === "bulk" && (
                  <BulkEntry
                    examTypeId={examTypeId}
                    classId={classId}
                    students={students}
                    subjects={subjects}
                  />
                )}
              </>
            )}

            {/* ── Nav Buttons ── */}
            <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
              <div>
                {step > 1 && (
                  <button onClick={() => setStep(step - 1)} className="btn-outline">
                    ← Back
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                {step === 4 && (
                  <button onClick={resetFlow} className="btn-outline">
                    🔄 Start Over
                  </button>
                )}
                {step < 4 && (
                  <button
                    disabled={!canNext()}
                    onClick={() => setStep(step + 1)}
                    className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80">
            <h4 className="font-semibold text-gray-800 mb-3">New Exam Type</h4>
            <input
              className="input mb-1"
              placeholder="e.g. Mid Term, Final Exam"
              value={newExamType}
              onChange={e => { setNewExamType(e.target.value); setModalErr(""); }}
              onKeyDown={e => e.key === "Enter" && createExam()}
              autoFocus
            />
            {modalErr && <p className="text-red-500 text-xs mb-2 mt-1">{modalErr}</p>}
            <div className="flex gap-2 mt-3">
              <button onClick={createExam} className="btn-primary flex-1">Create</button>
              <button
                onClick={() => { setShowModal(false); setModalErr(""); setNewExamType(""); }}
                className="btn-outline flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarksheetDashboard;