// import axios from "axios";
// import { AuthProvider } from "./state/auth.jsx";
// import "./index.css";

// axios.defaults.baseURL = import.meta.env.VITE_API_URL || "";

// export default function Root({ children }) {
//   return <AuthProvider>{children}</AuthProvider>;
// }

import React from "react";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "../state/auth.jsx"; // adjust path if needed
import "./index.css";

export default function App() {
  return (
    <AuthProvider>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#fff",
          color: "#000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "2rem",
        }}
      >
        <h1>Store Rating App</h1> {/* optional header */}
        <Outlet /> {/* THIS is where nested routes render */}
      </div>
    </AuthProvider>
  );
}
