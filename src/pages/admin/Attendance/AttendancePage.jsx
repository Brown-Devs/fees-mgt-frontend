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
  const [loading, setLoading] = useState(false);

  /* ----------------------------------------
     Fetch classes
  ---------------------------------------- */
  useEffect(() => {
    api
      .get("/api/classes")
      .then((res) => setClasses(res.data.data))
      .catch((err) => console.error("Failed to load classes:", err));
  }, []);

  /* ----------------------------------------
     Auto-fill section & stream
  ---------------------------------------- */
  useEffect(() => {
    if (!classId) {
      setSection("");
      setStream("");
      return;
    }

    const selectedClass = classes.find((c) => c._id === classId);
    if (selectedClass) {
      setSection(selectedClass.section);
      setStream(selectedClass.stream);
    }
  }, [classId, classes]);

  /* ----------------------------------------
     Fetch students + attendance
  ---------------------------------------- */
  useEffect(() => {
    if (!classId || !section || !stream || !date) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // 1️⃣ Fetch students
        const studentRes = await api.get(
          `/api/students?classId=${classId}&section=${section}&stream=${stream}`
        );

        setStudents(studentRes.data.data);

        // Initialize attendance map
        const init = {};
        studentRes.data.data.forEach((s) => {
          init[s._id] = "";
        });

        // 2️⃣ Fetch saved attendance
        const attendanceRes = await api.get("/api/attendance", {
          params: { classId, section, stream, date },
        });

        attendanceRes.data.data.forEach((r) => {
          init[r.studentId._id] = r.status;
        });

        setAttendance(init);
      } catch (err) {
        console.error("Failed to load attendance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classId, section, stream, date]);

  /* ----------------------------------------
     Toggle attendance
  ---------------------------------------- */
  const toggleStatus = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  /* ----------------------------------------
     Save attendance
  ---------------------------------------- */
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

  const allMarked =
    students.length > 0 &&
    students.every((s) => attendance[s._id]);

  /* ----------------------------------------
     UI
  ---------------------------------------- */
  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-[#0a1a44]">
        Attendance
      </h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="border p-2"
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
          className="border p-2"
        />
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <>
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
                  className={`border-t ${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-blue-50`}
                >
                  <td className="p-3">{s.rollNo}</td>
                  <td className="p-3">
                    {s.firstName} {s.lastName || ""}
                  </td>
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

          {/* Footer */}
          <div className="flex justify-between items-center mt-6 p-4 bg-gray-100 rounded-lg">
            <div className="flex gap-6">
              <span className="font-semibold text-green-600">
                Present:{" "}
                {
                  Object.values(attendance).filter(
                    (v) => v === "Present"
                  ).length
                }
              </span>
              <span className="font-semibold text-red-600">
                Absent:{" "}
                {
                  Object.values(attendance).filter(
                    (v) => v === "Absent"
                  ).length
                }
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
        </>
      )}
    </div>
  );
};

export default AttendancePage;
