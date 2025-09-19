

import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../state/auth.jsx";
import "../theme.css";

export default function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <header className="header">
        <div className="nav-inner">
          <nav className="navbar">
            <div className="nav-brand">Store Ratings</div>

            <div className="nav-links">
              <Link to="/">Home</Link>
              <Link to="/stores">Stores</Link>
              {user?.role === "admin" && <Link to="/admin">Admin</Link>}
              {user?.role === "owner" && <Link to="/owner">Owner</Link>}
            </div>

            <div className="nav-spacer" />

            <div className="nav-user-actions">
              {user ? (
                <>
                  <Link to="/profile">Profile</Link>
                  <button
                    className="btn ghost"
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <button className="btn ghost">Login</button>
                  </Link>
                  <Link to="/signup">
                    <button className="btn">Sign Up</button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
