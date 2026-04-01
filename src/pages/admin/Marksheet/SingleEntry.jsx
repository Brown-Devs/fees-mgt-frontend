import React, { useState } from "react";
import api from "../../../apis/axios";

export default function SingleEntry({ examTypeId, classId, student, subjects }) {
  const [marks, setMarks] = useState({});

  const handleSubmit = async () => {
    const formatted = subjects.map(s => ({
      ...s,
      obtainedMarks: marks[s.name] || ""
    }));

    await api.post("/api/marksheets", {
      examTypeId,
      classId,
      studentId: student._id,
      subjects: formatted
    });

    alert("Saved!");
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm p-5">

      <h3 className="text-lg font-semibold mb-4">
        {student.firstName} {student.lastName}
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Subject</th>
              <th className="px-4 py-3 text-center">Full Marks</th>
              <th className="px-4 py-3 text-center">Obtained</th>
            </tr>
          </thead>

          <tbody>
            {subjects.map((s, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3 text-center">{s.fullMarks}</td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="number"
                    className="w-20 border border-gray-300 rounded-md px-2 py-1 text-center focus:ring-2 focus:ring-blue-500"
                    value={marks[s.name] || ""}
                    onChange={(e) =>
                      setMarks({ ...marks, [s.name]: e.target.value })
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-right">
        <button onClick={handleSubmit} className="btn-primary">
          Save Marks
        </button>
      </div>
    </div>
  );
}