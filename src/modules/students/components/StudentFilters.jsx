import React from "react";

const StudentFilters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="student-filters">
      <select
        name="admissionSession"
        value={filters.admissionSession}
        onChange={handleChange}
      >
        <option value="">All Sessions</option>
        <option value="2023-24">2023-24</option>
        <option value="2024-25">2024-25</option>
        {/* later load from API */}
      </select>

      <select name="classId" value={filters.classId} onChange={handleChange}>
        <option value="">All Classes</option>
        {/* map classes from props or context */}
      </select>

      <select name="section" value={filters.section} onChange={handleChange}>
        <option value="">All Sections</option>
        <option value="A">A</option>
        <option value="B">B</option>
      </select>

      <select name="gender" value={filters.gender} onChange={handleChange}>
        <option value="">All Genders</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    </div>
  );
};

export default StudentFilters;
