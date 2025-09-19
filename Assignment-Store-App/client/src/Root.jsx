// client/src/Root.jsx
import { Outlet } from "react-router-dom";
import { AuthProvider } from "./state/auth.jsx";

export default function Root() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Outlet />
      </div>
    </AuthProvider>
  );
}
