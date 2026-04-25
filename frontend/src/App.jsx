import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import ProtectedRoute from "./components/UI/ProtectedRoute";

import LoginPage     from "./pages/LoginPage";
import RegisterPage  from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import BoardPage     from "./pages/BoardPage";
import AnalyticsPage from "./pages/AnalyticsPage";

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: "#1e293b", color: "#f1f5f9", border: "1px solid #334155" },
            }}
          />
          <Routes>
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/"           element={<DashboardPage />} />
              <Route path="/board/:id"  element={<BoardPage />} />
              <Route path="/analytics"  element={<AnalyticsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}
