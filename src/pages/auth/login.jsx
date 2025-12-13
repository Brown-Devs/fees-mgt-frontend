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

 const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  try {
    const payload = { email: (email || "").trim().toLowerCase(), password };
    console.log("LOGIN payload:", payload);

    const res = await api.post("/api/auth/login", payload);

    console.log("LOGIN raw response:", res);
    // normalize token/user paths (support both {token,user} and {data:{token,user}})
    const body = res.data || {};
    const token = body.token || body.data?.token || body.result?.token;
    const user = body.user || body.data?.user || body.result?.user;

    if (!token || !user) {
      console.warn("Unexpected login response shape:", body);
      throw new Error("Unexpected login response");
    }

    login(user, token);

    // redirect based on role
    switch (user.role) {
      case "superadmin": navigate("/superadmin/dashboard"); break;
      case "admin": navigate("/admin/dashboard"); break;
      case "accountant": navigate("/accountant/dashboard"); break;
      case "teacher": navigate("/teacher/dashboard"); break;
      case "parent": navigate("/parent/dashboard"); break;
      default: navigate("/");
    }
  } catch (err) {
    console.error("LOGIN error (detailed):", err);
    setError(err.response?.data?.message || err.message || "Login failed");
  }
};


  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm space-y-4">

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
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>
      </form>
    </div>
  );
}
