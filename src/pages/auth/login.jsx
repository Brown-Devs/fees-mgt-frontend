import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../apis/axios";
import { useAuth } from "../../contexts/AuthContext";
import illustration from "../../assets/login.png";

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
    <div className="min-h-screen bg-[#0b2c5f] flex items-center justify-center px-6">

      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 
                      rounded-3xl overflow-hidden shadow-2xl">

        {/* LEFT – FORM */}
        <div className="bg-[#0d3b7a] text-white px-20 py-20 flex items-center">
          <div className="w-full max-w-lg">

            <h1 className="text-4xl font-semibold mb-2">
              Welcome
            </h1>
            <p className="text-blue-200 mb-14 text-base">
              Login to your account
            </p>

            {error && (
              <div className="mb-6 text-sm text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-10">

              <div>
                <label className="block text-sm text-blue-200 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-transparent border-b border-blue-300
                             py-3 text-white text-base
                             focus:outline-none focus:border-white"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-blue-200 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full bg-transparent border-b border-blue-300
                             py-3 text-white text-base
                             focus:outline-none focus:border-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600
                           py-3.5 rounded-md font-medium text-lg
                           transition disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

          </div>
        </div>

        {/* RIGHT – FULL IMAGE COVER */}
        <div className="hidden md:block relative">
          <img
            src={illustration}
            alt="Login Illustration"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        </div>

      </div>
    </div>
  );
}
