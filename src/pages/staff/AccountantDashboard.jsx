// src/pages/staff/AccountantDashboard.jsx
import { useEffect, useState, useRef } from "react";
import api from "../../apis/axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend,
} from "chart.js";
import {
  HiOutlineBanknotes, HiOutlineCurrencyRupee,
  HiOutlineCheckCircle, HiOutlineClock,
} from "react-icons/hi2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const NAVY = "#0a1a44";

export default function AccountantDashboard() {
  const [counts, setCounts] = useState({});
  const [series, setSeries] = useState({});
  const pollingRef = useRef(null);

  useEffect(() => {
    fetchStats();
    pollingRef.current = setInterval(fetchStats, 30000);
    return () => clearInterval(pollingRef.current);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/api/stats/dashboard");
      setCounts(res.data.data?.counts || {});
      setSeries(res.data.data?.series || {});
    } catch (err) {
      console.error(err);
    }
  };

  const allMonths = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthMap = {};
  (series.months || []).forEach((m, i) => { monthMap[m] = series.feesSeries?.[i] || 0; });
  const fullYearData = allMonths.map(m => monthMap[m] || 0);

  const feesData = {
    labels: allMonths,
    datasets: [{ data: fullYearData, backgroundColor: NAVY, borderRadius: 12, maxBarThickness: 40 }],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#64748b" } },
      y: { beginAtZero: true, grid: { color: "rgba(148,163,184,0.2)" }, ticks: { color: "#64748b" } },
    },
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Pending Fees"       value={counts.pendingFees ?? "—"}       icon={<HiOutlineBanknotes />} />
        <KpiCard title="Today's Collection" value={counts.todaysCollection ?? "—"}   icon={<HiOutlineCurrencyRupee />} />
        <KpiCard title="Active Enquiries"   value={counts.activeEnquiries ?? "—"}    icon={<HiOutlineCheckCircle />} />
        <KpiCard title="Total Students"     value={counts.totalStudents ?? "—"}      icon={<HiOutlineBanknotes />} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#e6ebff] overflow-hidden">
        <div className="px-6 py-4 bg-[#eef2ff] border-b">
          <h3 className="font-semibold text-[#0a1a44]">Fees Collection Trend</h3>
        </div>
        <div className="p-6">
          <Bar data={feesData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon }) {
  return (
    <div className="relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#0a1a44] rounded-t-2xl" />
      <div className="flex items-center gap-4 mt-2">
        <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-[#eef2ff] text-[#0a1a44] text-xl">
          {icon}
        </div>
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-2xl font-semibold text-[#0a1a44] mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}
