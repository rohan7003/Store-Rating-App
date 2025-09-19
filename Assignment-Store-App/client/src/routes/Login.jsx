

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Joi from "joi";
import axios from "axios";
import { useAuth } from "../state/auth.jsx";
import { Card, Field, Input, Button } from "../components/UI.jsx";

const schema = Joi.object({
  email: Joi.string().email({ tlds: false }).required(),
  password: Joi.string().min(1).required(),
});

export default function Login() {
  const { setToken, setUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  function update(field, value) {
    const next = { ...form, [field]: value };
    setForm(next);
    const { error } = schema.validate(next, { abortEarly: false });
    const errObj = {};
    error?.details.forEach((d) => {
      errObj[d.path[0]] = d.message;
    });
    setErrors(errObj);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axios.post("/auth/login", form);
      setToken(data.token);
      setUser(data.user);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="hero">
      <div className="hero-auth">
        <Card>
          <div className="text-center mb-4">
            <h2 className="card-title">Welcome back</h2>
            <p className="text-muted">Sign in to your account to continue</p>
          </div>

          <form onSubmit={onSubmit} className="form-grid">
            <Field label="Email" error={errors.email}>
              <Input
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                type="email"
                autoComplete="email"
              />
            </Field>

            <Field label="Password" error={errors.password}>
              <Input
                placeholder="••••••••"
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                autoComplete="current-password"
              />
            </Field>

            <Button
              type="submit"
              disabled={submitting || Object.keys(errors).length}
              className="w-full"
            >
              {submitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center" style={{ marginTop: "1.5rem" }}>
            <p className="text-muted">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary">
                Create one here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
