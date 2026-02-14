import React, { useState, useEffect } from "react";
import api from "../../../apis/axios";
import PageHeader from "../../../components/common/PageHeader";
import TableCard from "../../../components/common/TableCard";

const AttendancePage = () => {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState("");
  const [section, setSection] = useState("");
  const [stream, setStream] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);

  /* ---------------- Fetch Classes ---------------- */
  useEffect(() => {
    api
      .get("/api/classes")
      .then((res) => setClasses(res.data.data || []))
      .catch((err) => console.error(err));
  }, []);

  /* ---------------- Auto fill section & stream ---------------- */
  useEffect(() => {
    if (!classId) {
      setSection("");
      setStream("");
      return;
    }

    const selected = classes.find((c) => c._id === classId);
    if (selected) {
      setSection(selected.section);
      setStream(selected.stream);
    }
  }, [classId, classes]);

  /* ---------------- Fetch Students + Attendance ---------------- */
  useEffect(() => {
    if (!classId || !section || !stream || !date) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const studentRes = await api.get(
          `/api/students?classId=${classId}&section=${section}&stream=${stream}`
        );

        const studentData = studentRes.data.data || [];
        setStudents(studentData);

        const init = {};
        studentData.forEach((s) => {
          init[s._id] = "";
        });

        const attendanceRes = await api.get("/api/attendance", {
          params: { classId, section, stream, date },
        });

        (attendanceRes.data.data || []).forEach((r) => {
          init[r.studentId._id] = r.status;
        });

        setAttendance(init);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classId, section, stream, date]);

  /* ---------------- Toggle Status ---------------- */
  const toggleStatus = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  /* ---------------- Save Attendance ---------------- */
  const saveAttendance = async () => {
    const today = new Date().toISOString().split("T")[0];
    if (date !== today) return alert("Cannot save past attendance");

    const records = Object.entries(attendance)
      .filter(([_, status]) => status)
      .map(([studentId, status]) => ({
        studentId,
        classId,
        section,
        stream,
        date,
        status,
      }));

    await api.post("/api/attendance/save", { records });
    alert("Attendance saved successfully!");
  };

  const presentCount = Object.values(attendance).filter(
    (v) => v === "Present"
  ).length;

  const absentCount = Object.values(attendance).filter(
    (v) => v === "Absent"
  ).length;

  const allMarked =
    students.length > 0 &&
    students.every((s) => attendance[s._id]);

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/80 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">

        <PageHeader
          title="Attendance"
          subtitle="Mark and manage daily student attendance."
        />

        <TableCard title="Attendance Register">

          {/* Filters */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#001f3f]/20"
            >
              <option value="">Select Class</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.section} - {c.stream})
                </option>
              ))}
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl"
            />
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Loading attendance...
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Roll
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                        Father
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                        Present
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                        Absent
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {students.map((s) => (
                      <tr key={s._id} className="hover:bg-[#001f3f]/[0.02]">
                        <td className="px-6 py-4">{s.rollNo}</td>
                        <td className="px-6 py-4 font-medium">
                          {s.firstName} {s.lastName || ""}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {s.fatherName}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() =>
                              toggleStatus(s._id, "Present")
                            }
                            className={`px-4 py-1 rounded-full text-xs font-semibold transition ${
                              attendance[s._id] === "Present"
                                ? "bg-emerald-600 text-white"
                                : "bg-gray-200 hover:bg-emerald-100"
                            }`}
                          >
                            ✓ Present
                          </button>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() =>
                              toggleStatus(s._id, "Absent")
                            }
                            className={`px-4 py-1 rounded-full text-xs font-semibold transition ${
                              attendance[s._id] === "Absent"
                                ? "bg-rose-600 text-white"
                                : "bg-gray-200 hover:bg-rose-100"
                            }`}
                          >
                            ✗ Absent
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-6 bg-gray-50 rounded-xl p-4">
                <div className="flex gap-6 text-sm font-semibold">
                  <span className="text-emerald-600">
                    Present: {presentCount}
                  </span>
                  <span className="text-rose-600">
                    Absent: {absentCount}
                  </span>
                </div>

                <button
                  onClick={saveAttendance}
                  disabled={!allMarked}
                  className={`px-6 py-2 rounded-xl font-semibold transition ${
                    allMarked
                      ? "bg-[#001f3f] text-white hover:bg-[#001933]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Save Attendance
                </button>
              </div>
            </>
          )}

        </TableCard>
      </div>
    </div>
  );
};

export default AttendancePage;
