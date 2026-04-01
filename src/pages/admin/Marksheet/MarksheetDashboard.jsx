import React, { useState, useEffect } from "react";
import api from "../../../apis/axios";
import PageHeader from "../../../components/common/PageHeader";
import SingleEntry from "./SingleEntry";
import BulkEntry from "./BulkEntry";

const steps = ["Exam Setup", "Subjects", "Mode", "Entry"];

const MarksheetDashboard = () => {
  const [step, setStep] = useState(1);

  const [examTypes, setExamTypes] = useState([]);
  const [examTypeId, setExamTypeId] = useState("");
  const [newExamType, setNewExamType] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [section, setSection] = useState("");
  const [stream, setStream] = useState("");

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");

  const [subjects, setSubjects] = useState([
    { name: "", fullMarks: "" }
  ]);

  const [mode, setMode] = useState("single");

  /* ---------------- Fetch ---------------- */
  useEffect(() => {
    api.get("/api/exam-types").then(res => setExamTypes(res.data.data || []));
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

  /* ---------------- Exam Create ---------------- */
  const createExam = async () => {
    const res = await api.post("/api/exam-types", { name: newExamType });
    setExamTypes([...examTypes, res.data.data]);
    setExamTypeId(res.data.data._id);
    setNewExamType("");
    setShowModal(false);
  };

  /* ---------------- Subject ---------------- */
  const addSubject = () => {
    setSubjects([...subjects, { name: "", fullMarks: "" }]);
  };

  const updateSubject = (i, field, value) => {
    const copy = [...subjects];
    copy[i][field] = value;
    setSubjects(copy);
  };

  const canNext = () => {
    if (step === 1) return examTypeId && classId;
    if (step === 2) return subjects.every(s => s.name && s.fullMarks);
    return true;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <PageHeader title="Marksheet Setup" subtitle="Manage marks easily" />

      {/* Stepper */}
      <div className="flex justify-between mb-6">
        {steps.map((s, i) => (
          <div key={i} className="text-center flex-1">
            <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center
              ${step >= i + 1 ? "bg-[#0b1f3a] text-white" : "bg-gray-200"}`}>
              {i + 1}
            </div>
            <p className="text-xs mt-1">{s}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow p-6">

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h3 className="font-semibold mb-4">Exam & Class</h3>

            <div className="grid md:grid-cols-2 gap-4">

              {/* Exam */}
              <div>
                <label>Exam Type</label>
                <div className="flex gap-2">
                  <select
                    className="input"
                    value={examTypeId}
                    onChange={(e) => setExamTypeId(e.target.value)}
                  >
                    <option value="">Select Exam</option>
                    {examTypes.map(et => (
                      <option key={et._id} value={et._id}>{et.name}</option>
                    ))}
                  </select>

                  <button onClick={() => setShowModal(true)} className="btn-primary">+</button>
                </div>
              </div>

              {/* Class */}
              <div>
                <label>Class</label>
                <select
                  className="input"
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
              </div>
            </div>

            {classId && (
              <div className="mt-3 text-sm">
                Section: <b>{section}</b> | Stream: <b>{stream}</b>
              </div>
            )}
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h3 className="font-semibold mb-4">Subjects</h3>

            {subjects.map((s, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  className="input"
                  placeholder="Subject"
                  value={s.name}
                  onChange={(e) => updateSubject(i, "name", e.target.value)}
                />
                <input
                  className="input"
                  type="number"
                  placeholder="Full Marks"
                  value={s.fullMarks}
                  onChange={(e) => updateSubject(i, "fullMarks", e.target.value)}
                />
              </div>
            ))}

            <button onClick={addSubject} className="btn-outline">+ Add</button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h3 className="font-semibold mb-4">Mode</h3>

            <div className="flex gap-4">
  <button
    onClick={() => setMode("single")}
    className={`px-4 py-2 rounded-lg border transition ${
      mode === "single"
        ? "bg-[#0b1f3a] text-white border-[#0b1f3a]"
        : "bg-white text-gray-700"
    }`}
  >
    Single Entry
  </button>

  <button
    onClick={() => setMode("bulk")}
    className={`px-4 py-2 rounded-lg border transition ${
      mode === "bulk"
        ? "bg-[#0b1f3a] text-white border-[#0b1f3a]"
        : "bg-white text-gray-700"
    }`}
  >
    Bulk Entry
  </button>
</div>
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <>
            <h3 className="font-semibold mb-4">Enter Marks</h3>

            {mode === "single" && (
              <>
                <select
                  className="input mb-4 bg-white text-black"
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

                {selectedStudent && (
                  <SingleEntry
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

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 && <button onClick={() => setStep(step - 1)} className="btn-outline">Back</button>}
          {step < 4 && <button disabled={!canNext()} onClick={() => setStep(step + 1)} className="btn-primary">Next</button>}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl">
            <input
              className="input mb-3"
              placeholder="Exam Name"
              value={newExamType}
              onChange={(e) => setNewExamType(e.target.value)}
            />
            <button onClick={createExam} className="btn-primary">Create</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarksheetDashboard;