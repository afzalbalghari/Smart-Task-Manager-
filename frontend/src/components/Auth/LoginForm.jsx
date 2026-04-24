import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../UI/Button";
import toast from "react-hot-toast";

export default function LoginForm() {
  const [form, setForm]     = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-slate-400 mb-1">Email</label>
        <input
          type="email" required className="input"
          placeholder="you@example.com"
          value={form.email}
          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
        />
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-1">Password</label>
        <input
          type="password" required className="input"
          placeholder="••••••••"
          value={form.password}
          onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
        />
      </div>
      <Button type="submit" loading={loading} className="w-full justify-center">
        Sign In
      </Button>
      <p className="text-center text-sm text-slate-500">
        No account?{" "}
        <Link to="/register" className="text-primary-400 hover:text-primary-300">Register</Link>
      </p>
    </form>
  );
}
