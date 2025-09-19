
import { Link } from "react-router-dom";
import { Button, Card } from "../components/UI.jsx";
import { useAuth } from "../state/auth.jsx";

export default function Home() {
  const { user } = useAuth();
  const isLoggedIn = Boolean(user);

  return (
    <div className="hero">
      <div className="hero-content">
        <Card>
          <div className="text-center">
            <h1>
              {isLoggedIn
                ? `Welcome${user?.name ? `, ${user.name.split(" ")[0]}` : ""}`
                : "Rate your favorite stores"}
            </h1>
            <p className="text-muted">
              {isLoggedIn
                ? "Jump back in to explore stores, rate them, or manage your dashboard."
                : "Discover stores, submit ratings, and manage your own store ratings with a clean and secure experience."}
            </p>
            <div className="row row-center" style={{ marginTop: "1.5rem" }}>
              <Link to="/stores">
                <Button>Browse Stores</Button>
              </Link>
              {!isLoggedIn && (
                <Link to="/signup">
                  <Button className="secondary">Create Account</Button>
                </Link>
              )}
              {isLoggedIn && user?.role === "admin" && (
                <Link to="/admin">
                  <Button className="secondary">Admin Dashboard</Button>
                </Link>
              )}
              {isLoggedIn && user?.role === "owner" && (
                <Link to="/owner">
                  <Button className="secondary">Owner Dashboard</Button>
                </Link>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
