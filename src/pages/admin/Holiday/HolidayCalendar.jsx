import React, { useState, useEffect } from "react";
import api from "../../../apis/axios";
import PageHeader from "../../../components/common/PageHeader";
import TableCard from "../../../components/common/TableCard";

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
      setHolidays(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching holidays:", err);
      setHolidays([]);
    }
  };

  const handleSaveHoliday = async () => {
    if (!newHoliday.name || !newHoliday.date) return;

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
    if (!window.confirm("Delete this holiday?")) return;
    try {
      await api.delete(`/api/holidays/${id}`);
      fetchHolidays();
    } catch (err) {
      console.error("Error deleting holiday:", err);
    }
  };

  // 🔥 FIXED HOLIDAY DATE CHECK
  const getHoliday = (year, month, day) => {
    return holidays.find((h) => {
      const holidayDate = new Date(h.date);
      return (
        holidayDate.getFullYear() === year &&
        holidayDate.getMonth() === month &&
        holidayDate.getDate() === day
      );
    });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/80 py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-8">

          <PageHeader
            title="Holiday Calendar"
            subtitle="Manage academic holidays."
            buttonText="+ Add Holiday"
            onButtonClick={() => setShowModal(true)}
          />

          <div className="grid lg:grid-cols-3 gap-8">

            {/* Compact Calendar */}
            <TableCard title="Calendar">
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() =>
                    setCurrentMonth((m) => (m === 0 ? 11 : m - 1))
                  }
                  className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Prev
                </button>

                <h2 className="text-lg font-semibold text-[#001f3f]">
                  {monthNames[currentMonth]} {currentYear}
                </h2>

                <button
                  onClick={() =>
                    setCurrentMonth((m) => (m === 11 ? 0 : m + 1))
                  }
                  className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Next
                </button>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 text-xs text-center text-gray-500 mb-2">
                {["S","M","T","W","T","F","S"].map((d) => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {Array(firstDay).fill(null).map((_, i) => (
                  <div key={i}></div>
                ))}

                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const holiday = getHoliday(currentYear, currentMonth, day);

                  const isToday =
                    day === today.getDate() &&
                    currentMonth === today.getMonth() &&
                    currentYear === today.getFullYear();

                  return (
                    <div
                      key={i}
                      title={holiday ? holiday.name : ""}
                      className={`py-1.5 rounded-md font-medium transition-all
                        ${
                          holiday
                            ? "bg-rose-500 text-white shadow"
                            : isToday
                            ? "border border-[#001f3f] text-[#001f3f]"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </TableCard>

            {/* Holiday List */}
            <div className="lg:col-span-2">
              <TableCard title="Holiday List">
                {holidays.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No holidays added yet.
                  </p>
                ) : (
                  <div className="divide-y">
                    {holidays.map((h) => (
                      <div
                        key={h._id}
                        className="py-4 flex justify-between items-center"
                      >
                        <div>
                          <p className="font-semibold text-[#001f3f]">
                            {h.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(h.date).toLocaleDateString()}
                          </p>
                        </div>

                        <button
                          onClick={() => handleDelete(h._id)}
                          className="text-rose-600 font-medium hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </TableCard>
            </div>

          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[420px] p-6 space-y-4">
            <h3 className="text-xl font-semibold text-[#001f3f]">
              Add Holiday
            </h3>

            <input
              type="text"
              placeholder="Holiday Name"
              value={newHoliday.name}
              onChange={(e) =>
                setNewHoliday({ ...newHoliday, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
            />

            <input
              type="date"
              value={newHoliday.date}
              onChange={(e) =>
                setNewHoliday({ ...newHoliday, date: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-xl"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveHoliday}
                className="px-4 py-2 bg-[#001f3f] text-white rounded-xl hover:bg-[#001933]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
