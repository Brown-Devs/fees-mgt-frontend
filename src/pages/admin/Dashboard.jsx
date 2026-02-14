import React, { useEffect, useState, useRef } from "react";
import api from "../../apis/axios";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
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
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const NAVY = "#0a1a44";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({});
  const [series, setSeries] = useState({});
  const pollingRef = useRef(null);

  useEffect(() => {
    fetchStats();
    pollingRef.current = setInterval(fetchStats, 30000);
    return () => clearInterval(pollingRef.current);
  }, []);

  const fetchStats = async () => {
    const res = await api.get("/api/stats/dashboard");
    setCounts(res.data.data?.counts || {});
    setSeries(res.data.data?.series || {});
  };

  /* ===================== FEES BAR OPTIONS ===================== */

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: NAVY,
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748b" },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(148,163,184,0.2)" },
        ticks: { color: "#64748b" },
      },
    },
  };

  /* ===================== DOUGHNUT OPTIONS ===================== */

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#334155",
          padding: 15,
        },
      },
    },
    cutout: "70%",
  };

  /* ===================== FEES DATA (ALL 12 MONTHS) ===================== */

  const allMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const monthMap = {};
  (series.months || []).forEach((month, index) => {
    monthMap[month] = series.feesSeries?.[index] || 0;
  });

  const fullYearData = allMonths.map((m) => monthMap[m] || 0);

  const feesData = {
    labels: allMonths,
    datasets: [
      {
        data: fullYearData,
        backgroundColor: NAVY,
        borderRadius: 12,
        maxBarThickness: 40,
      },
    ],
  };

  /* ===================== INCOME DATA ===================== */

  const feeIncome = series.incomeByType?.Fee || 0;
  const nonFeeIncome = series.incomeByType?.["Non Fee"] || 0;
  const totalIncome = feeIncome + nonFeeIncome;

  const incomeData = {
    labels: ["Fee", "Non Fee"],
    datasets: [
      {
        data: [feeIncome, nonFeeIncome],
        backgroundColor: [NAVY, "#c7d2fe"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-10">

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Students"
          value={counts.totalStudents ?? "—"}
          icon={<HiOutlineUserGroup />}
        />
        <KpiCard
          title="Pending Fees"
          value={counts.pendingFees ?? "—"}
          icon={<HiOutlineBanknotes />}
        />
        <KpiCard
          title="Today's Collection"
          value={counts.todaysCollection ?? "—"}
          icon={<HiOutlineCurrencyRupee />}
        />
        <KpiCard
          title="Active Enquiries"
          value={counts.activeEnquiries ?? "—"}
          icon={<HiOutlineClipboardDocumentCheck />}
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Fees Collection Trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[#e6ebff] overflow-hidden">
          <div className="px-6 py-4 bg-[#eef2ff] border-b">
            <h3 className="font-semibold text-[#0a1a44]">
              Fees Collection Trend
            </h3>
          </div>
          <div className="p-6">
            <Bar data={feesData} options={barOptions} />
          </div>
        </div>

        {/* Income Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e6ebff] overflow-hidden flex flex-col">

          <div className="px-6 py-4 bg-[#eef2ff] border-b">
            <h3 className="font-semibold text-[#0a1a44]">
              Income Distribution
            </h3>
          </div>

          <div className="flex-1 flex items-center justify-center p-6">
            <div className="relative w-72 h-72 flex items-center justify-center">

              <Doughnut data={incomeData} options={doughnutOptions} />

              <div className="absolute text-center">
                <p className="text-xs text-slate-500">Total Income</p>
                <p className="text-xl font-semibold text-[#0a1a44]">
                  ₹ {totalIncome.toLocaleString("en-IN")}
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ===================== KPI CARD ===================== */

function KpiCard({ title, value, icon }) {
  return (
    <div className="relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
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
