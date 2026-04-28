import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// StrictMode removed — it causes double API calls in dev which breaks POST requests
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
