import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../apis/axios";
import { useAuth } from "../../contexts/AuthContext";
import illustration from "../../assets/loginn.webp";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        email: email.trim().toLowerCase(),
        password,
      };

      const res = await api.post("/api/auth/login", payload);
      const { token, user } = res.data || {};

      if (!token || !user) throw new Error("Invalid login response");

      login(user, token);

      switch (user.role) {
        case "superadmin":
          navigate("/superadmin/dashboard");
          break;
        case "admin":
          navigate("/admin");
          break;
        case "accountant":
          navigate("/accountant/dashboard");
          break;
        case "teacher":
          navigate("/teacher/dashboard");
          break;
        case "parent":
          navigate("/parent/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f8ff] flex items-center justify-center px-6">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-[0_24px_60px_rgba(0,0,0,0.08)] grid grid-cols-1 lg:grid-cols-2 overflow-hidden">

        {/* ================= LEFT SECTION ================= */}
        <div className="relative bg-[#edf4ff] px-20 pt-20 pb-16 flex flex-col justify-between overflow-hidden">

          {/* soft wave background */}
          <div className="absolute inset-0">
            <svg
              viewBox="0 0 1440 700"
              className="absolute bottom-0 w-full h-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0,260 C360,340 720,140 1040,220 1240,280 1440,160 1440,160 L1440,700 L0,700 Z"
                fill="#e4efff"
              />
            </svg>
          </div>

          {/* title */}
          <div className="relative z-10 text-center">
            <h2 className="text-2xl font-semibold text-[#2b3a5a]">
              School Management System
            </h2>
          </div>

          {/* illustration */}
          <div className="relative z-10 flex justify-center mt-12">
            <div className="relative">
              <img
                src={illustration}
                alt="School management illustration"
                className="w-full max-w-[820px] select-none"
                draggable={false}
              />
              {/* ground shadow */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[60%] h-6 bg-black/10 blur-2xl rounded-full" />
            </div>
          </div>

          {/* feature cards */}
          <div className="relative z-10 flex justify-center gap-8 -mt-4">
            <FeatureCard
              title="Academics"
              desc="Classes, attendance & exams"
              icon="📘"
            />
            <FeatureCard
              title="Fees & Accounts"
              desc="Billing & payments"
              icon="💰"
            />
            <FeatureCard
              title="Reports & Communication"
              desc="Insights & communication"
              icon="📊"
            />
          </div>
        </div>

        {/* ================= RIGHT SECTION ================= */}
        <div className="px-16 py-16 flex items-center justify-center">
          <div className="w-full max-w-md">

            <h2 className="text-3xl font-semibold text-gray-800 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-500 mb-8">
              Login to access your dashboard
            </p>

            {error && (
              <div className="mb-6 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Login to Dashboard"}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              Secure access for authorized users only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= FEATURE CARD ================= */

function FeatureCard({ title, desc, icon }) {
  return (
    <div className="bg-white w-64 px-6 py-5 rounded-2xl text-center
                    shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
      <div className="text-2xl mb-2">{icon}</div>
      <h4 className="text-sm font-semibold text-gray-800">
        {title}
      </h4>
      <p className="text-xs text-gray-500 mt-1">
        {desc}
      </p>
    </div>
  );
}
