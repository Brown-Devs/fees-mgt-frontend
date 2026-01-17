import React, { useState, useEffect } from "react";
import api from "../../../apis/axios";

export default function HolidayCalendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [holidays, setHolidays] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newHoliday, setNewHoliday] = useState({ name: "", date: "" });

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const res = await api.get("/api/holidays");
      setHolidays(res.data.data || []);
    } catch (err) {
      console.error("Error fetching holidays:", err);
      setHolidays([]);
    }
  };

  const handleSaveHoliday = async () => {
    try {
      await api.post("/api/holidays", newHoliday);
      setShowModal(false);
      setNewHoliday({ name: "", date: "" });
      fetchHolidays();
    } catch (err) {
      console.error("Error saving holiday:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/holidays/${id}`);
      fetchHolidays();
    } catch (err) {
      console.error("Error deleting holiday:", err);
    }
  };

  const isHoliday = (dateStr) =>
    holidays.some(h => h.date.startsWith(dateStr));

  return (
    <div className="flex gap-6 p-6 bg-[#f5f7fb] min-h-screen">

      {/* Calendar */}
      <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setCurrentMonth(m => m === 0 ? 11 : m - 1)}
            className="px-4 py-1 rounded bg-[#e6e9f5] text-[#0a1a44] font-medium"
          >
            Prev
          </button>

          <h2 className="text-2xl font-bold text-[#0a1a44]">
            {monthNames[currentMonth]} {currentYear}
          </h2>

          <button
            onClick={() => setCurrentMonth(m => m === 11 ? 0 : m + 1)}
            className="px-4 py-1 rounded bg-[#e6e9f5] text-[#0a1a44] font-medium"
          >
            Next
          </button>
        </div>

        <div className="grid grid-cols-7 text-center text-sm font-semibold text-gray-600 mb-3">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 text-center">
          {Array(firstDay).fill(null).map((_, i) => (
            <div key={i}></div>
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => {
            const dateStr = `${currentYear}-${String(currentMonth+1).padStart(2,"0")}-${String(i+1).padStart(2,"0")}`;
            const holiday = isHoliday(dateStr);

            return (
              <div
                key={i}
                className={`py-2 rounded-lg cursor-pointer font-medium
                  ${holiday
                    ? "bg-red-500 text-white shadow"
                    : "hover:bg-[#eef1fb] text-[#0a1a44]"
                  }`}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* Holiday List */}
      <div className="w-80 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-[#0a1a44] mb-4">
          Holiday Calendar
        </h3>

        <ul className="space-y-3 text-sm">
          {holidays.map(h => (
            <li
              key={h._id}
              className="flex justify-between items-center bg-[#f5f7fb] px-3 py-2 rounded"
            >
              <span>
                {h.name}
                <br />
                <span className="text-xs text-gray-500">
                  {new Date(h.date).toLocaleDateString()}
                </span>
              </span>
              <button
                onClick={() => handleDelete(h._id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setShowModal(true)}
          className="mt-6 w-full bg-[#0a1a44] text-white py-2 rounded-lg hover:bg-[#122a6f]"
        >
          Add Holiday
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold text-[#0a1a44] mb-4">
              Add Holiday
            </h2>

            <label className="block text-sm mb-1">Holiday Name</label>
            <input
              className="w-full border rounded px-3 py-2 mb-4"
              value={newHoliday.name}
              onChange={e => setNewHoliday({ ...newHoliday, name: e.target.value })}
            />

            <label className="block text-sm mb-1">Holiday Date</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2 mb-4"
              value={newHoliday.date}
              onChange={e => setNewHoliday({ ...newHoliday, date: e.target.value })}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveHoliday}
                className="px-4 py-2 rounded bg-[#0a1a44] text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
