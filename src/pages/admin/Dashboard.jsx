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
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import {
  HiOutlineUserGroup,
  HiOutlineBanknotes,
  HiOutlineCurrencyRupee,
  HiOutlineClipboardDocumentCheck,
} from "react-icons/hi2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);

const NAVY = "#0a1a44";

export default function AdminDashboard() {
  const [school, setSchool] = useState(null);
  const [counts, setCounts] = useState({});
  const [series, setSeries] = useState({});
  const pollingRef = useRef(null);

  const today = new Date().toLocaleDateString("en-IN", {
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
    const schoolRes = await api.get("/api/schools/me");
    setSchool(schoolRes.data.data);
    fetchStats();
  };

  const fetchStats = async () => {
    const res = await api.get("/api/stats/dashboard");
    setCounts(res.data.data?.counts || {});
    setSeries(res.data.data?.series || {});
  };

  const feesData = {
    labels: series.months || [],
    datasets: [
      {
        label: "Fees Collected",
        data: series.feesSeries || [],
        borderColor: NAVY,
        backgroundColor: "rgba(10,26,68,0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  const incomeData = {
    labels: ["Fee", "Non Fee"],
    datasets: [
      {
        data: [
          series.incomeByType?.Fee || 0,
          series.incomeByType?.["Non Fee"] || 0,
        ],
        backgroundColor: [NAVY, "#c7d2fe"],
      },
    ],
  };

  return (
    <div className="space-y-10">

      {/* HEADER (MORE NAVY) */}
      <div className="relative rounded-2xl p-8 shadow-md
                      bg-gradient-to-r from-[#0a1a44] to-[#122b6b] text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">
              Welcome, {school?.name || ""}
            </h2>
            <p className="text-white/80 mt-1">
              Academic & financial overview
            </p>
          </div>
          <div className="text-sm text-white/70">{today}</div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Students" value={counts.totalStudents ?? "—"} icon={<HiOutlineUserGroup />} />
        <KpiCard title="Pending Fees" value={counts.pendingFees ?? "—"} icon={<HiOutlineBanknotes />} />
        <KpiCard title="Today's Collection" value={counts.todaysCollection ?? "—"} icon={<HiOutlineCurrencyRupee />} />
        <KpiCard title="Active Enquiries" value={counts.activeEnquiries ?? "—"} icon={<HiOutlineClipboardDocumentCheck />} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Fees Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[#e6ebff] overflow-hidden">
          <div className="px-6 py-4 bg-[#eef2ff] border-b">
            <h3 className="font-semibold text-[#0a1a44]">
              Fees Collection Trend
            </h3>
          </div>
          <div className="p-6">
            <Line data={feesData} />
          </div>
        </div>

        {/* Income Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e6ebff] overflow-hidden">
          <div className="px-6 py-4 bg-[#eef2ff] border-b">
            <h3 className="font-semibold text-[#0a1a44]">
              Income Distribution
            </h3>
          </div>
          <div className="p-6">
            <Bar data={incomeData} />
          </div>
        </div>

      </div>
    </div>
  );
}

/* ===================== KPI CARD (NAVY ACCENT) ===================== */
function KpiCard({ title, value, icon }) {
  return (
    <div className="relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      {/* Navy Accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#0a1a44] rounded-t-2xl" />

      <div className="flex items-center gap-4 mt-2">
        <div className="h-12 w-12 rounded-xl flex items-center justify-center
                        bg-[#eef2ff] text-[#0a1a44] text-xl">
          {icon}
        </div>

        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-2xl font-semibold text-[#0a1a44] mt-1">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
