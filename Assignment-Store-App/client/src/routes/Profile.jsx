
// Profile.jsx
import { useState } from "react";
import Joi from "joi";
import axios from "axios";
import { Card, Field, Input, Button } from "../components/UI.jsx";

const schema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .max(16)
    .pattern(new RegExp(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/))
    .required(),
});

export default function Profile() {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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
      await axios.post("/auth/update-password", form);
      alert("Password updated successfully!");
      setForm({ oldPassword: "", newPassword: "" });
      setErrors({});
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="hero">
      <div className="hero-auth">
        <Card>
          <div className="text-center mb-4">
            <h2 className="card-title">Update Password</h2>
            <p className="text-muted">Change your account password</p>
          </div>

          <form onSubmit={onSubmit} className="form-grid">
            <Field label="Current Password" error={errors.oldPassword}>
              <Input
                placeholder="Enter current password"
                type="password"
                value={form.oldPassword}
                onChange={(e) => update("oldPassword", e.target.value)}
                autoComplete="current-password"
              />
            </Field>

            <Field
              label="New Password"
              error={errors.newPassword}
              help="8-16 characters, 1 uppercase, 1 special character"
            >
              <Input
                placeholder="Enter new password"
                type="password"
                value={form.newPassword}
                onChange={(e) => update("newPassword", e.target.value)}
                autoComplete="new-password"
              />
            </Field>

            <Button
              type="submit"
              disabled={submitting || Object.keys(errors).length}
            >
              {submitting ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
