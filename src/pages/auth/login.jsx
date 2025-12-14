import { useState } from "react";
import api from "../../apis/axios";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
      if (!token || !user) {
        throw new Error("Invalid login response");
      }

      // save auth
      login(user, token);

      // redirect by role
      switch (user.role) {
        case "superadmin":
          navigate("/superadmin/dashboard");
          break;
        case "admin":
          navigate("/admin"); // IMPORTANT: admin dashboard root
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
    <div className="relative h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Full-screen loader overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 bg-white/70 backdrop-blur-sm flex items-center justify-center">
          <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-lg shadow">
            <span className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-slate-700">
              Signing you in…
            </span>
          </div>
        </div>
      )}

      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded text-white transition
            ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {loading && (
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
