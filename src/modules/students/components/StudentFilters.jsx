import React from "react";

const StudentFilters = ({
  search,
  setSearch,
  admissionSession,
  setAdmissionSession,
  classId,
  setClassId,
  section,
  setSection,
  gender,
  setGender,
}) => {
  return (
    <div className="student-filters flex gap-3 bg-white p-4 rounded shadow">
      
      {/* Search */}
      <input
        type="text"
        placeholder="Search by name or roll no..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded"
      />

      {/* Session */}
      <select
        value={admissionSession}
        onChange={(e) => setAdmissionSession(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="">All Sessions</option>
        <option value="2023-24">2023-24</option>
        <option value="2024-25">2024-25</option>
      </select>

      {/* Class */}
      <select
        value={classId}
        onChange={(e) => setClassId(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="">All Classes</option>
      </select>

      {/* Section */}
      <select
        value={section}
        onChange={(e) => setSection(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="">All Sections</option>
        <option value="A">A</option>
        <option value="B">B</option>
      </select>

      {/* Gender */}
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="">All Genders</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    </div>
  );
};

export default StudentFilters;
