import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../apis/axios";
import { useAuth } from "../../contexts/AuthContext";
import illustration from "../../assets/logi.jpg";

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
        case "branch_admin": // ← FIX: was missing — branch_admin fell to default → navigate("/") → 404
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
    <div className="min-h-screen flex flex-col lg:flex-row font-poppins">

      {/* ================= LEFT PANEL ================= */}
      <div className="relative w-full lg:w-[65%] flex items-center overflow-hidden">

        {/* Background Image */}
        <img
          src={illustration}
          alt="School Background"
          className="absolute inset-0 w-full h-full object-cover scale-105 blur-[2px]"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/65 via-blue-800/55 to-blue-700/45"></div>

        {/* Left Fade for Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/70 via-blue-900/40 to-transparent"></div>

        {/* Content */}
        <div className="relative z-10 px-16 lg:px-24 py-24 text-white">

          <h1 className="text-5xl lg:text-6xl font-semibold leading-tight tracking-tight mb-6 max-w-2xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
            Empowering{" "}
            <span className="bg-gradient-to-r from-blue-300 to-cyan-200 bg-clip-text text-transparent">
              Smarter Schools
            </span>
            <br />
            Through Digital Excellence
          </h1>

          <p className="text-white/90 text-base lg:text-lg mb-10 max-w-xl leading-relaxed">
            A unified platform to simplify administration, elevate academic
            management, and strengthen school-wide collaboration.
          </p>

          {/* Compact Feature Badges */}
          <div className="flex flex-wrap gap-4 mt-6">

            <MiniFeature icon="🎓" title="Academics" />
            <MiniFeature icon="💳" title="Fee Automation" />
            <MiniFeature icon="📊" title="Smart Reports" />
            <MiniFeature icon="📩" title="Parent Connect" />

          </div>
        </div>
      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div className="w-full lg:w-[35%] bg-white flex items-center justify-center px-10 lg:px-16 py-24">

        <div className="w-full max-w-sm">

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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition duration-200"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition duration-200"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white transition duration-300 shadow-lg hover:shadow-blue-500/30"
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
  );
}

/* ================= MINI FEATURE BADGE ================= */

function MiniFeature({ icon, title }) {
  return (
    <div className="
      flex items-center gap-2
      bg-white/10
      backdrop-blur-md
      border border-white/20
      px-4 py-2
      rounded-full
      text-sm
      font-medium
      text-white
      transition duration-300
      hover:bg-white/20
    ">
      <span>{icon}</span>
      <span>{title}</span>
    </div>
  );
}
