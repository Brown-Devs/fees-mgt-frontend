import React, { useEffect, useState } from "react";
import api from "../../../apis/axios";

export default function ComplaintForm({ onSaved, onClose }) {
    const [form, setForm] = useState({
        title: "",
        description: "",
        complaintType: "",
        targetId: "",
        classId: "",
        targetName: "",
        sectionId: "",
        streamId: "",
        phone: ""
    });

    const [targets, setTargets] = useState([]);
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);

    /* ================= LOAD CLASSES ================= */
    useEffect(() => {
        api
            .get("/api/classes")
            .then(res => setClasses(res.data?.data || []))
            .catch(() => setClasses([]));
    }, []);

    /* ========== AUTO FILL SECTION & STREAM FROM CLASS ========== */
    useEffect(() => {
        if (!form.classId) {
            setForm(prev => ({ ...prev, sectionId: "", streamId: "" }));
            return;
        }

        const selectedClass = classes.find(c => c._id === form.classId);
        if (selectedClass) {
            setForm(prev => ({
                ...prev,
                sectionId: selectedClass.section,
                streamId: selectedClass.stream
            }));
        }
    }, [form.classId, classes]);

    /* ================= LOAD TEACHERS / ACCOUNTANTS ================= */
    useEffect(() => {
        if (!form.complaintType) return;

        setTargets([]);
        setForm(prev => ({ ...prev, targetId: "" }));

        if (form.complaintType === "Teacher" || form.complaintType === "Accountant") {
            api
                .get("/api/users")
                .then(res => {
                    const users = res.data?.data || [];

                    const filtered = users
                        .filter(u => u.role === form.complaintType.toLowerCase())
                        .map(u => ({
                            _id: u._id,
                            fullName: u.fullName   // ✅ backend field
                        }));

                    setTargets(filtered);
                })
                .catch(() => setTargets([]));
        }
    }, [form.complaintType]);

    /* ================= LOAD STUDENTS ================= */
    useEffect(() => {
        if (
            form.complaintType !== "Student" ||
            !form.classId ||
            !form.sectionId ||
            !form.streamId
        )
            return;

        api
            .get(
                `/api/students?classId=${form.classId}&section=${form.sectionId}&stream=${form.streamId}`
            )
            .then(res => {
                const students = res.data?.data || [];

                const normalized = students.map(s => ({
                    _id: s._id,
                    fullName: `${s.firstName} ${s.lastName || ""}`.trim(),
                    rollNo: s.rollNo
                }));

                setTargets(normalized);
            })
            .catch(() => setTargets([]));
    }, [form.complaintType, form.classId, form.sectionId, form.streamId]);

    /* ================= SUBMIT ================= */
    const submit = async () => {
        if (!form.title || !form.complaintType) {
            return alert("Title and Complaint Against are required");
        }

        if (
            ["Teacher", "Accountant", "Student"].includes(form.complaintType) &&
            !form.targetId
        ) {
            return alert("Please select a person");
        }

        setLoading(true);
        try {
            await api.post("/api/complaints", form);
            onSaved();
        } catch (err) {
            console.error(err);
            alert("Failed to submit complaint");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
            <h3 className="text-lg font-semibold text-[#0a1a44]">
                Add Complaint
            </h3>

            <div className="grid grid-cols-2 gap-4">
                <input
                    className="input"
                    placeholder="Title"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                />

                <input
                    className="input"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                />

                {/* Complaint Against */}
                <select
                    className="input col-span-2"
                    value={form.complaintType}
                    onChange={e =>
                        setForm({
                            ...form,
                            complaintType: e.target.value,
                            targetId: ""
                        })
                    }
                >
                    <option value="">Complaint Against</option>
                    <option value="School">School</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Student">Student</option>
                </select>

                {/* TEACHER / ACCOUNTANT */}
                {["Teacher", "Accountant"].includes(form.complaintType) && (
                    <select
                        className="input col-span-2"
                        value={form.targetId}
                        onChange={e => {
                            const selected = targets.find(t => t._id === e.target.value);
                            setForm({
                                ...form,
                                targetId: e.target.value,
                                targetName: selected?.fullName || ""
                            });
                        }}
                    >
                        <option value="">Select {form.complaintType}</option>
                        {targets.map(u => (
                            <option key={u._id} value={u._id}>
                                {u.fullName}
                            </option>
                        ))}
                    </select>


                )}

                {/* STUDENT */}
                {form.complaintType === "Student" && (
                    <>
                        <select
                            className="input"
                            value={form.targetId}
                            onChange={e => {
                                const selected = targets.find(s => s._id === e.target.value);
                                setForm({
                                    ...form,
                                    targetId: e.target.value,
                                    targetName: selected
                                        ? `${selected.fullName}${selected.rollNo ? ` (${selected.rollNo})` : ""}`
                                        : ""
                                });
                            }}
                        >
                            <option value="">Select Student</option>
                            {targets.map(s => (
                                <option key={s._id} value={s._id}>
                                    {s.fullName} {s.rollNo ? `(${s.rollNo})` : ""}
                                </option>
                            ))}
                        </select>

                    </>
                )}

                <textarea
                    className="input col-span-2"
                    rows="3"
                    placeholder="Description"
                    value={form.description}
                    onChange={e =>
                        setForm({ ...form, description: e.target.value })
                    }
                />
            </div>

            <div className="flex justify-end gap-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 rounded bg-gray-100"
                >
                    Cancel
                </button>

                <button
                    onClick={submit}
                    disabled={loading}
                    className="px-4 py-2 rounded bg-[#0a1a44] text-white"
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </div>

            <style>{`
        .input {
          padding: 0.6rem;
          border: 1px solid #dbe2f1;
          border-radius: 0.5rem;
          width: 100%;
        }
        .input:focus {
          outline: none;
          border-color: #0a1a44;
          box-shadow: 0 0 0 2px rgba(10,26,68,0.15);
        }
      `}</style>
        </div>
    );
}
