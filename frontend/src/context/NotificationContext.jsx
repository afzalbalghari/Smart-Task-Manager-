import { createContext, useContext, useState, useEffect } from "react";
import { analyticsService } from "../services/analyticsService";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!token) return;
    const fetch = async () => {
      try {
        const data = await analyticsService.getNotifications();
        setNotifications(data);
        setUnread(data.length);
      } catch { /* ignore */ }
    };
    fetch();
    const id = setInterval(fetch, 5 * 60 * 1000); // refresh every 5 min
    return () => clearInterval(id);
  }, [token]);

  const markRead = () => setUnread(0);

  return (
    <NotificationContext.Provider value={{ notifications, unread, markRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
