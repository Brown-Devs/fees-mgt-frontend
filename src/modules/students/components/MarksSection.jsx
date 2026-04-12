import React, { useEffect, useState } from "react";
import api from "../../../apis/axios";

const getGrade = (p) => {
  if (p >= 90) return "A+";
  if (p >= 75) return "A";
  if (p >= 60) return "B";
  if (p >= 40) return "C";
  return "F";
};

const MarksSection = ({ student }) => {
  const [examTypes, setExamTypes] = useState([]);
  const [examTypeId, setExamTypeId] = useState("");
  const [marksheet, setMarksheet] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- GET EXAMS ---------------- */
  useEffect(() => {
    api.get("/api/exam-types")
      .then(res => {
        console.log("Exam Types 👉", res.data);
        setExamTypes(res.data.data || []);
      })
      .catch(err => console.error(err));
  }, []);

  /* ---------------- GET MARKS ---------------- */
  useEffect(() => {
    if (!examTypeId || !student?._id) return;

    console.log("Fetching Marks For:", {
      studentId: student._id,
      examTypeId
    });

    setLoading(true);

    api
      .get(`/api/marksheets/student/${student._id}?examTypeId=${examTypeId}`)
      .then((res) => {
        console.log("Marks API Response 👉", res.data);

        // 🔥 HANDLE ALL POSSIBLE RESPONSE STRUCTURES
        const data =
          res.data?.data ||
          res.data ||
          null;

        if (data && data.subjects && data.subjects.length > 0) {
          setMarksheet(data);
        } else {
          setMarksheet(null);
        }
      })
      .catch((err) => {
        console.error("Marks Fetch Error:", err);
        setMarksheet(null);
      })
      .finally(() => setLoading(false));
  }, [examTypeId, student]);

  /* ---------------- SAFE DATA ---------------- */
  const subjects = marksheet?.subjects || [];

  const totalObtained = subjects.reduce(
    (acc, s) => acc + Number(s.obtainedMarks || 0),
    0
  );

  const totalMarks = subjects.reduce(
    (acc, s) => acc + Number(s.fullMarks || 0),
    0
  );

  const percentage = totalMarks
    ? ((totalObtained / totalMarks) * 100).toFixed(2)
    : 0;

  const grade = getGrade(Number(percentage));

  return (
    <div className="bg-white shadow rounded-xl p-6">

      <h3 className="text-xl font-semibold mb-2">
        Report Card
      </h3>

      {/* Student Info */}
      <p className="text-sm text-gray-600 mb-4">
        {student.rollNo} - {student.firstName} {student.lastName}
      </p>

      {/* Exam Select */}
      <select
        className="border border-gray-300 rounded px-3 py-2 mb-4 w-full"
        value={examTypeId}
        onChange={(e) => setExamTypeId(e.target.value)}
      >
        <option value="">Select Exam</option>
        {examTypes.map((e) => (
          <option key={e._id} value={e._id}>
            {e.name} ({e._id})
          </option>
        ))}
      </select>

      {/* Loading */}
      {loading && (
        <p className="text-gray-500">Loading marks...</p>
      )}

      {/* No Data */}
      {!loading && examTypeId && subjects.length === 0 && (
        <p className="text-red-500">
          No marks found → Check exam selection
        </p>
      )}

      {/* TABLE */}
      {!loading && subjects.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border text-left">Subject</th>
                  <th className="p-2 border text-center">Full</th>
                  <th className="p-2 border text-center">Marks</th>
                </tr>
              </thead>

              <tbody>
                {subjects.map((s, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2">{s.name}</td>
                    <td className="p-2 text-center">{s.fullMarks}</td>
                    <td className="p-2 text-center font-semibold">
                      {s.obtainedMarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-4 flex justify-between text-sm font-medium">
            <p>Total: {totalObtained} / {totalMarks}</p>
            <p>Percentage: {percentage}%</p>
            <p>Grade: {grade}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default MarksSection;