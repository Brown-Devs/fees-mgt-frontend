import React, { useState } from "react";
import api from "../../../apis/axios";

export default function BulkEntry({ examTypeId, classId, students, subjects }) {
  const [marks, setMarks] = useState(
    students.map(stu => ({
      studentId: stu._id,
      subjects: subjects.map(s => ({ ...s, obtainedMarks: "" }))
    }))
  );

  const handleChange = (r, c, val) => {
    const copy = [...marks];
    copy[r].subjects[c].obtainedMarks = val;
    setMarks(copy);
  };

  const handleSubmit = async () => {
    await api.post("/api/marksheets/bulk", {
      examTypeId,
      classId,
      marksheets: marks
    });
    alert("Saved!");
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm p-5 overflow-x-auto">

      <h3 className="text-lg font-semibold mb-4">Bulk Entry</h3>

      <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden min-w-[700px]">
        
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-3 text-left">Student</th>

            {subjects.map((s, i) => (
              <th key={i} className="px-4 py-3 text-center">
                {s.name}
                <div className="text-xs text-gray-500">
                  ({s.fullMarks})
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {marks.map((row, rIdx) => (
            <tr key={row.studentId} className="border-t hover:bg-gray-50">
              
              <td className="px-4 py-3 font-medium">
                {students[rIdx].firstName} {students[rIdx].lastName}
              </td>

              {row.subjects.map((sub, cIdx) => (
                <td key={cIdx} className="px-4 py-2 text-center">
                  <input
                    type="number"
                    className="w-16 border border-gray-300 rounded-md px-2 py-1 text-center focus:ring-2 focus:ring-blue-500"
                    value={sub.obtainedMarks}
                    onChange={(e) =>
                      handleChange(rIdx, cIdx, e.target.value)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 text-right">
        <button onClick={handleSubmit} className="btn-primary">
          Save All
        </button>
      </div>
    </div>
  );
}