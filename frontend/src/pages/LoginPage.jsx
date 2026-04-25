import LoginForm from "../components/Auth/LoginForm";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 bg-primary-500 rounded-2xl items-center justify-center mb-4 text-2xl">
            🧠
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Welcome back</h1>
          <p className="text-slate-500 mt-1 text-sm">Sign in to your workspace</p>
        </div>
        <div className="card p-6 shadow-2xl">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
