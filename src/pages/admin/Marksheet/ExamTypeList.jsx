import React, { useEffect, useState } from "react";
import api from "../../../apis/axios";
import ExamTypeForm from "./ExamTypeForm";

export default function ExamTypeList() {
  const [examTypes, setExamTypes] = useState([]);

  const loadExamTypes = async () => {
    const res = await api.get("/api/exam-types");
    setExamTypes(res.data.data);
  };

  useEffect(() => { loadExamTypes(); }, []);

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Exam Types</h2>
      <ExamTypeForm onSuccess={loadExamTypes} />
      <ul className="mt-4">
        {examTypes.map(et => (
          <li key={et._id} className="border-b py-2">
            <strong>{et.name}</strong> — {et.description || "No description"}
          </li>
        ))}
      </ul>
    </div>
  );
}
