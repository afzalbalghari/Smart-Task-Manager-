import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../UI/Button";
import toast from "react-hot-toast";

export default function RegisterForm() {
  const [form, setForm]     = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/");
      toast.success("Welcome aboard! 🚀");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-slate-400 mb-1">Full Name</label>
        <input
          type="text" required className="input"
          placeholder="Alex Johnson"
          value={form.name}
          onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
        />
      </div>
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
          type="password" required minLength={6} className="input"
          placeholder="Min 6 characters"
          value={form.password}
          onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
        />
      </div>
      <Button type="submit" loading={loading} className="w-full justify-center">
        Create Account
      </Button>
      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link to="/login" className="text-primary-400 hover:text-primary-300">Sign in</Link>
      </p>
    </form>
  );
}
