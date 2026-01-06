import { useState } from "react";
import api from "../../apis/axios";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import loginVisual from "../../assets/login.png"; 

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
        email: (email || "").trim().toLowerCase(),
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
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4 relative">
      {/* 🔹 Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 bg-white/70 backdrop-blur-sm flex items-center justify-center">
          <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-lg">
            <span className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-slate-700">
              Signing you in…
            </span>
          </div>
        </div>
      )}

      {/* 🔹 Main Card */}
      <div className="w-full max-w-5xl flex shadow-xl rounded-3xl overflow-hidden bg-white min-h-[520px]">
        
        {/* LEFT – LOGIN FORM */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-10">
          <div className="w-full max-w-sm">
            <h2 className="text-3xl font-bold text-slate-900 mb-1">
              Welcome
            </h2>
            <p className="text-slate-500 mb-6">
              Login to your account
            </p>

            {error && (
              <div className="mb-4 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base
                           focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />

              <input
                type="password"
                placeholder="Password"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base
                           focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-lg
                           transition-all hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Logging in..." : "Sign in"}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT – VISUAL */}
       {/* RIGHT – FULL COVER VISUAL */}
<div className="hidden md:block md:w-1/2 relative bg-blue-100">
  <img
    src={loginVisual}
    alt="School Management System"
    className="absolute inset-0 w-full h-full object-cover"
    draggable={false}
  />
</div>

      </div>
    </div>
  );
}
