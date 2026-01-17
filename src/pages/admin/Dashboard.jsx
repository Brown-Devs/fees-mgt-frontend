import React, { useEffect, useState, useRef } from "react";
import api from "../../apis/axios";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminDashboard() {
  const [school, setSchool] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [counts, setCounts] = useState({
    totalStudents: 0,
    pendingFees: 0,
    todaysCollection: 0,
    activeEnquiries: 0
  });
  const [series, setSeries] = useState({
    months: [],
    feesSeries: [],
    incomeByType: { Fee: 0, "Non Fee": 0 },
    attendanceSeries: []
  });

  const pollingRef = useRef(null);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    fetchInitial();
    pollingRef.current = setInterval(fetchStats, 30000);
    return () => clearInterval(pollingRef.current);
  }, []);

  const fetchInitial = async () => {
    try {
      const [schoolRes, annRes] = await Promise.all([
        api.get("/api/schools/me"),
        api.get("/api/announcements")
      ]);
      setSchool(schoolRes.data.data);
      setAnnouncements(annRes.data.data || []);
      await fetchStats();
    } catch (err) {
      console.error("Dashboard error:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/api/stats/dashboard");
      if (res.data && res.data.data) {
        setCounts(res.data.data.counts || {});
        setSeries(res.data.data.series || {});
      }
    } catch (err) {
      console.error("Stats fetch error:", err);
    }
  };

  /* ---------- Chart Config ---------- */

  const feesData = {
    labels: series.months,
    datasets: [
      {
        label: "Fees Collected",
        data: series.feesSeries,
        borderColor: "#0a1a44",
        backgroundColor: "rgba(10,26,68,0.08)",
        fill: true,
        tension: 0.3,
        pointRadius: 4
      }
    ]
  };

  const incomeData = {
    labels: ["Fee", "Non Fee"],
    datasets: [
      {
        label: "Income",
        data: [
          series.incomeByType?.Fee || 0,
          series.incomeByType?.["Non Fee"] || 0
        ],
        backgroundColor: ["#0a1a44", "#66c2ff"]
      }
    ]
  };

  const attendanceData = {
    labels: series.months,
    datasets: [
      {
        label: "Attendance %",
        data: series.attendanceSeries,
        borderColor: "#066d3b",
        backgroundColor: "rgba(6,109,59,0.08)",
        fill: true,
        tension: 0.3,
        pointRadius: 3
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false }
    },
    scales: { y: { beginAtZero: true } }
  };

  return (
    <div className="p-6 bg-[#f5f7fb] min-h-screen space-y-6">

      <div className="text-sm text-gray-600 font-medium">{formattedDate}</div>

      <div className="rounded-2xl p-6 bg-gradient-to-r from-[#eef2ff] to-[#dbe4ff] shadow">
        <h1 className="text-2xl font-bold text-[#0a1a44]">
          Welcome {school ? school.name : ""}
        </h1>
        <p className="mt-2 text-gray-700">
          Manage academics, finance, and operations from one place.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Total Students" value={counts.totalStudents ?? "—"} bg="bg-blue-50" text="text-blue-900" />
        <StatCard title="Pending Fees" value={counts.pendingFees ?? "—"} bg="bg-yellow-50" text="text-yellow-900" />
        <StatCard title="Today's Collection" value={counts.todaysCollection ?? "—"} bg="bg-green-50" text="text-green-900" />
        <StatCard title="Active Enquiries" value={counts.activeEnquiries ?? "—"} bg="bg-purple-50" text="text-purple-900" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl p-4 shadow">
          <h3 className="font-semibold mb-2">Fees Collected</h3>
          <Line data={feesData} options={chartOptions} />
        </div>

        <div className="bg-white rounded-2xl p-4 shadow">
          <h3 className="font-semibold mb-2">Income by Type</h3>
          <Bar data={incomeData} options={chartOptions} />
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl p-4 shadow">
          <h3 className="font-semibold mb-2">Attendance Trend</h3>
          <Line data={attendanceData} options={{ ...chartOptions, scales: { y: { max: 100 } } }} />
        </div>
      </div>

      <div className="bg-[#f8f9ff] rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Announcements</h2>
        {announcements.length === 0 ? (
          <p className="text-gray-500">No announcements available.</p>
        ) : (
          announcements.map(a => (
            <div key={a._id} className="bg-white rounded-xl p-4 mb-3">
              <h3 className="font-semibold">{a.title}</h3>
              <p>{a.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, bg, text }) {
  return (
    <div className={`rounded-2xl p-5 shadow ${bg}`}>
      <p className="text-sm opacity-70">{title}</p>
      <p className={`mt-2 text-3xl font-bold ${text}`}>{value}</p>
    </div>
  );
}
