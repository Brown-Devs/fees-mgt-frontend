import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [school, setSchool] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const schoolRes = await axios.get("/api/schools/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setSchool(schoolRes.data.data);

        const annRes = await axios.get("/api/announcements", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setAnnouncements(annRes.data.data || []); 
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <div className="text-navy-700 text-lg font-bold mb-6">
        {formattedDate}
      </div>
      <div className="bg-gradient-to-r from-lightblue-400 to-navy-700 text-black rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold">
          Welcome {school ? school.name : ""}
        </h1>
        <p className="mt-2 text-lightblue-100">
          Every morning is a blank canvas... it is whatever you make out of it.
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-navy-700 text-xl font-bold mb-4">Announcements</h2>
        {announcements.length === 0 ? (
          <p className="text-gray-500">No announcements yet.</p>
        ) : (
          <div className="space-y-4">
            {announcements.map((a) => (
              <div key={a._id} className="border-b border-lightblue-200 pb-3">
                <h3 className="text-navy-700 font-semibold">{a.title}</h3>
                <p className="text-gray-700">{a.content}</p>
                <p className="text-sm text-lightblue-600">
                  {new Date(a.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
