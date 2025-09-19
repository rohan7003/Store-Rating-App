

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import Joi from "joi-browser";
import Joi from "joi";
import axios from "axios";
import { useAuth } from "../state/auth.jsx";
import { Card, Field, Input, Button } from "../components/UI.jsx";

const schema = Joi.object({
  name: Joi.string().min(2).max(60).required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(100)
    .required(),
  address: Joi.string().allow("", null).max(400),
  password: Joi.string()
    .min(8)
    .max(16)
    .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/)
    .required(),
});

export default function Signup() {
  const { setToken, setUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });
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
      const { data } = await axios.post("/auth/signup", form);
      setToken(data.token);
      setUser(data.user);
      navigate("/stores");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="hero">
      <div className="hero-content">
        <Card>
          <div className="text-center mb-4">
            <h2 className="card-title">Create your account</h2>
            <p className="text-muted">
              Join us to start rating and discovering stores
            </p>
          </div>

          <form onSubmit={onSubmit} className="form-grid">
            <Field
              label="Full name"
              error={errors.name}
              help="20-60 characters"
            >
              <Input
                placeholder="Your full name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                autoComplete="name"
              />
            </Field>

            <Field label="Email" error={errors.email}>
              <Input
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                type="email"
                autoComplete="email"
              />
            </Field>

            <Field label="Address" error={errors.address} help="Optional">
              <Input
                placeholder="Your address (optional)"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                autoComplete="address-line1"
              />
            </Field>

            <Field
              label="Password"
              error={errors.password}
              help="8-16 chars, 1 uppercase, 1 special"
            >
              <Input
                placeholder="••••••••"
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                autoComplete="new-password"
              />
            </Field>

            <Button
              type="submit"
              disabled={submitting || Object.keys(errors).length}
              className="w-full"
            >
              {submitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="text-center" style={{ marginTop: "1.5rem" }}>
            <p className="text-muted">
              Already have an account?{" "}
              <Link to="/login" className="text-primary">
                Sign in here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
