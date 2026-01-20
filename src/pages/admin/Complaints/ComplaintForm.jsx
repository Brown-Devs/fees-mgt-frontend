import React, { useEffect, useState } from "react";
import api from "../../../apis/axios";

export default function ComplaintForm({ onSaved, onClose }) {
    const [form, setForm] = useState({
        title: "",
        description: "",
        complaintType: "",
        targetId: "",
        classId: "",
        sectionId: "",
        streamId: "",
        phone: ""
    });

    const [teachers, setTeachers] = useState([]);
    const [accountants, setAccountants] = useState([]);
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [streams, setStreams] = useState([]);
    const [loading, setLoading] = useState(false);

    /* Load meta */
    useEffect(() => {
        api.get("/api/meta/classes").then(r => setClasses(r.data.data || []));
        api.get("/api/meta/sections").then(r => setSections(r.data.data || []));
        api.get("/api/meta/streams").then(r => setStreams(r.data.data || []));
    }, []);

    /* Load teachers / accountants */
    useEffect(() => {
        if (form.complaintType === "Teacher") {
            api.get("/api/meta/users", { params: { role: "teacher" } })
                .then(r => setTeachers(r.data.data || []));
        } else setTeachers([]);

        if (form.complaintType === "Accountant") {
            api.get("/api/meta/users", { params: { role: "accountant" } })
                .then(r => setAccountants(r.data.data || []));
        } else setAccountants([]);

        if (form.complaintType !== "Student") {
            setForm(f => ({ ...f, classId: "", sectionId: "", streamId: "" }));
            setStudents([]);
        }
    }, [form.complaintType]);

    /* Load students */
    useEffect(() => {
        if (
            form.complaintType === "Student" &&
            form.classId &&
            form.sectionId &&
            form.streamId
        ) {
            api.get("/api/meta/students", {
                params: {
                    class: form.classId,
                    section: form.sectionId,
                    stream: form.streamId
                }
            }).then(r => setStudents(r.data.data || []));
        }
    }, [form.complaintType, form.classId, form.sectionId, form.streamId]);

    const submit = async () => {
        if (!form.title || !form.complaintType) {
            return alert("Title and Complaint Against are required");
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
                    <option value="Accountant">Accountant</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Student">Student</option>
                </select>

                {/* Teacher */}
                {form.complaintType === "Teacher" && (
                    <select
                        className="input col-span-2"
                        value={form.targetId}
                        onChange={e => setForm({ ...form, targetId: e.target.value })}
                    >
                        <option value="">Select Teacher</option>
                        {teachers.map(t => (
                            <option key={t._id} value={t._id}>{t.name}</option>
                        ))}
                    </select>
                )}

                {/* Accountant */}
                {form.complaintType === "Accountant" && (
                    <select
                        className="input col-span-2"
                        value={form.targetId}
                        onChange={e => setForm({ ...form, targetId: e.target.value })}
                    >
                        <option value="">Select Accountant</option>
                        {accountants.map(a => (
                            <option key={a._id} value={a._id}>{a.name}</option>
                        ))}
                    </select>
                )}

                {/* Student flow */}
                {form.complaintType === "Student" && (
                    <>
                        <select
                            className="input"
                            value={form.classId}
                            onChange={e => setForm({ ...form, classId: e.target.value })}
                        >
                            <option value="">Class</option>
                            {classes.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>

                        <select
                            className="input"
                            value={form.sectionId}
                            onChange={e => setForm({ ...form, sectionId: e.target.value })}
                        >
                            <option value="">Section</option>
                            {sections.map(s => (
                                <option key={s._id} value={s._id}>{s.name}</option>
                            ))}
                        </select>

                        <select
                            className="input"
                            value={form.streamId}
                            onChange={e => setForm({ ...form, streamId: e.target.value })}
                        >
                            <option value="">Stream</option>
                            {streams.map(s => (
                                <option key={s._id} value={s._id}>{s.name}</option>
                            ))}
                        </select>

                        <select
                            className="input"
                            value={form.targetId}
                            onChange={e => setForm({ ...form, targetId: e.target.value })}
                        >
                            <option value="">Select Student</option>
                            {students.map(s => (
                                <option key={s._id} value={s._id}>
                                    {s.name} {s.rollNo ? `(${s.rollNo})` : ""}
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
                    onChange={e => setForm({ ...form, description: e.target.value })}
                />
            </div>

            <div className="flex justify-end gap-3">
                <button onClick={onClose} className="px-4 py-2 rounded bg-gray-100">
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
