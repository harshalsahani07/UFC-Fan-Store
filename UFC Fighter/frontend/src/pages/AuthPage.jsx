import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/client";
import { useApp } from "../context/AppContext";

const AuthPage = () => {
  const isLogin = useLocation().pathname === "/login";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginState } = useApp();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!isLogin && form.name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }
    if (!String(form.email).includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    if (String(form.password).length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/signup";
      const payload = isLogin
        ? { email: form.email.trim().toLowerCase(), password: form.password }
        : { ...form, name: form.name.trim(), email: form.email.trim().toLowerCase() };
      const { data } = await api.post(endpoint, payload);
      loginState(data.token, data.user);
      navigate(data.user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      if (!err.response) {
        setError("Server unreachable. Start backend and check API URL.");
      } else {
        setError(err.response?.data?.message || "Authentication failed");
      }
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">{isLogin ? "Login" : "Signup"}</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        {!isLogin && (
          <input className="w-full p-2 border rounded text-black" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        )}
        <input className="w-full p-2 border rounded text-black" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" className="w-full p-2 border rounded text-black" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-red-500">{error}</p>}
        <button className="px-4 py-2 rounded bg-red-600 text-white" type="submit">
          {isLogin ? "Login" : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default AuthPage;
