

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Field, Input, Button, Select } from "../components/UI.jsx";
import Joi from "joi";

const userSchema = Joi.object({
  name: Joi.string().min(2).max(60).required(),
  email: Joi.string().email({ tlds: false }).max(100).required(),
  address: Joi.string().allow("", null).max(400),
  password: Joi.string()
    .min(8)
    .max(16)
    .pattern(new RegExp(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/))
    .required(),
  role: Joi.string().valid("user", "admin", "owner").required(),
});

const storeSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  email: Joi.string().email({ tlds: false }).max(100).allow("", null),
  address: Joi.string().allow("", null).max(400),
  ownerId: Joi.alternatives().try(
    Joi.number().integer().positive(),
    Joi.allow("", null)
  ),
});

export default function Admin() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [filtersU, setFiltersU] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });
  const [filtersS, setFiltersS] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [sortU, setSortU] = useState({ by: "name", dir: "ASC" });
  const [sortS, setSortS] = useState({ by: "name", dir: "ASC" });
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "user",
  });
  const [userErrors, setUserErrors] = useState({});
  const [userSubmitting, setUserSubmitting] = useState(false);
  const [storeForm, setStoreForm] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });
  const [storeErrors, setStoreErrors] = useState({});
  const [storeSubmitting, setStoreSubmitting] = useState(false);

  async function load() {
    const [a, b, c] = await Promise.all([
      axios.get("/admin/dashboard"),
      axios.get("/admin/users"),
      axios.get("/admin/stores"),
    ]);
    setStats(a.data);
    setUsers(b.data);
    setStores(c.data);
  }

  useEffect(() => {
    load();
  }, []);

  function buildQuery(obj, sort) {
    const p = new URLSearchParams();
    Object.entries(obj).forEach(([k, v]) => {
      if (v) p.set(k, v);
    });
    p.set("sortBy", sort.by);
    p.set("sortDir", sort.dir);
    return p.toString();
  }

  async function applyUsers() {
    const { data } = await axios.get(
      `/admin/users?${buildQuery(filtersU, sortU)}`
    );
    setUsers(data);
  }

  async function applyStores() {
    const { data } = await axios.get(
      `/admin/stores?${buildQuery(filtersS, sortS)}`
    );
    setStores(data);
  }

  function updateUserForm(field, value) {
    const next = { ...userForm, [field]: value };
    setUserForm(next);
    const { error } = userSchema.validate(next, { abortEarly: false });
    const errs = {};
    error?.details.forEach((d) => {
      errs[d.path[0]] = d.message;
    });
    setUserErrors(errs);
  }

  async function addUser(e) {
    e.preventDefault();
    const { error } = userSchema.validate(userForm, { abortEarly: false });
    if (error) {
      const errs = {};
      error.details.forEach((d) => {
        errs[d.path[0]] = d.message;
      });
      setUserErrors(errs);
      return;
    }
    setUserSubmitting(true);
    try {
      await axios.post("/admin/add-user", userForm);
      await load();
      setUserForm({
        name: "",
        email: "",
        address: "",
        password: "",
        role: "user",
      });
      setUserErrors({});
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    } finally {
      setUserSubmitting(false);
    }
  }

  function updateStoreForm(field, value) {
    const next = { ...storeForm, [field]: value };
    setStoreForm(next);
    const { error } = storeSchema.validate(next, { abortEarly: false });
    const errs = {};
    error?.details.forEach((d) => {
      errs[d.path[0]] = d.message;
    });
    setStoreErrors(errs);
  }

  async function addStore(e) {
    e.preventDefault();
    const parsed = {
      ...storeForm,
      ownerId: storeForm.ownerId === "" ? null : Number(storeForm.ownerId),
    };
    const { error } = storeSchema.validate(parsed, { abortEarly: false });
    if (error) {
      const errs = {};
      error.details.forEach((d) => {
        errs[d.path[0]] = d.message;
      });
      setStoreErrors(errs);
      return;
    }
    setStoreSubmitting(true);
    try {
      await axios.post("/admin/add-store", parsed);
      await load();
      setStoreForm({ name: "", email: "", address: "", ownerId: "" });
      setStoreErrors({});
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    } finally {
      setStoreSubmitting(false);
    }
  }

  return (
    <div className="dashboard-section">
      {/* Dashboard Stats */}
      <Card>
        <div className="card-header">
          <h2 className="card-title">Admin Dashboard</h2>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Stores</div>
            <div className="stat-value">{stats.totalStores}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Ratings</div>
            <div className="stat-value">{stats.totalRatings}</div>
          </div>
        </div>
      </Card>

      {/* Add User and Store Forms */}
      <div className="grid-responsive">
        <Card>
          <div className="card-header">
            <h3 className="card-title">Add User</h3>
          </div>
          <form onSubmit={addUser} className="form-grid">
            <Field label="Name" error={userErrors.name} help="20-60 characters">
              <Input
                value={userForm.name}
                onChange={(e) => updateUserForm("name", e.target.value)}
                placeholder="Full name"
              />
            </Field>
            <Field label="Email" error={userErrors.email}>
              <Input
                value={userForm.email}
                onChange={(e) => updateUserForm("email", e.target.value)}
                placeholder="Email"
                type="email"
              />
            </Field>
            <Field label="Address" error={userErrors.address}>
              <Input
                value={userForm.address}
                onChange={(e) => updateUserForm("address", e.target.value)}
                placeholder="Address (optional)"
              />
            </Field>
            <Field
              label="Password"
              error={userErrors.password}
              help="8-16, 1 uppercase, 1 special"
            >
              <Input
                type="password"
                value={userForm.password}
                onChange={(e) => updateUserForm("password", e.target.value)}
                placeholder="Password"
              />
            </Field>
            <Field label="Role" error={userErrors.role}>
              <Select
                value={userForm.role}
                onChange={(e) => updateUserForm("role", e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
              </Select>
            </Field>
            <Button
              type="submit"
              disabled={userSubmitting || Object.keys(userErrors).length}
            >
              {userSubmitting ? "Adding..." : "Add User"}
            </Button>
          </form>
        </Card>

        <Card>
          <div className="card-header">
            <h3 className="card-title">Add Store</h3>
          </div>
          <form onSubmit={addStore} className="form-grid">
            <Field label="Name" error={storeErrors.name}>
              <Input
                value={storeForm.name}
                onChange={(e) => updateStoreForm("name", e.target.value)}
                placeholder="Store name"
              />
            </Field>
            <Field label="Email" error={storeErrors.email}>
              <Input
                value={storeForm.email}
                onChange={(e) => updateStoreForm("email", e.target.value)}
                placeholder="Email (optional)"
                type="email"
              />
            </Field>
            <Field label="Address" error={storeErrors.address}>
              <Input
                value={storeForm.address}
                onChange={(e) => updateStoreForm("address", e.target.value)}
                placeholder="Address"
              />
            </Field>
            <Field label="Owner ID" error={storeErrors.ownerId}>
              <Input
                value={storeForm.ownerId}
                onChange={(e) => updateStoreForm("ownerId", e.target.value)}
                placeholder="Owner user id (optional)"
              />
            </Field>
            <Button
              type="submit"
              disabled={storeSubmitting || Object.keys(storeErrors).length}
            >
              {storeSubmitting ? "Adding..." : "Add Store"}
            </Button>
          </form>
        </Card>
      </div>

      {/* Users Management */}
      <Card>
        <div className="card-header">
          <h3 className="card-title">Users</h3>
          <Button onClick={applyUsers} className="btn">
            Apply Filters
          </Button>
        </div>

        <div className="filters-row">
          <Input
            placeholder="Name"
            value={filtersU.name}
            onChange={(e) => setFiltersU({ ...filtersU, name: e.target.value })}
          />
          <Input
            placeholder="Email"
            value={filtersU.email}
            onChange={(e) =>
              setFiltersU({ ...filtersU, email: e.target.value })
            }
          />
          <Input
            placeholder="Address"
            value={filtersU.address}
            onChange={(e) =>
              setFiltersU({ ...filtersU, address: e.target.value })
            }
          />
          <Select
            value={filtersU.role}
            onChange={(e) => setFiltersU({ ...filtersU, role: e.target.value })}
          >
            <option value="">All roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
          </Select>
          <Select
            value={sortU.by}
            onChange={(e) => setSortU({ ...sortU, by: e.target.value })}
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="role">Role</option>
          </Select>
          <Select
            value={sortU.dir}
            onChange={(e) => setSortU({ ...sortU, dir: e.target.value })}
          >
            <option value="ASC">ASC</option>
            <option value="DESC">DESC</option>
          </Select>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.address || "-"}</td>
                  <td>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Stores Management */}
      <Card>
        <div className="card-header">
          <h3 className="card-title">Stores</h3>
          <Button onClick={applyStores} className="btn">
            Apply Filters
          </Button>
        </div>

        <div className="filters-row">
          <Input
            placeholder="Name"
            value={filtersS.name}
            onChange={(e) => setFiltersS({ ...filtersS, name: e.target.value })}
          />
          <Input
            placeholder="Email"
            value={filtersS.email}
            onChange={(e) =>
              setFiltersS({ ...filtersS, email: e.target.value })
            }
          />
          <Input
            placeholder="Address"
            value={filtersS.address}
            onChange={(e) =>
              setFiltersS({ ...filtersS, address: e.target.value })
            }
          />
          <Select
            value={sortS.by}
            onChange={(e) => setSortS({ ...sortS, by: e.target.value })}
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
          </Select>
          <Select
            value={sortS.dir}
            onChange={(e) => setSortS({ ...sortS, dir: e.target.value })}
          >
            <option value="ASC">ASC</option>
            <option value="DESC">DESC</option>
          </Select>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Avg Rating</th>
                <th>Total Ratings</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email || "-"}</td>
                  <td>{s.address || "-"}</td>
                  <td>{Number(s.averageRating).toFixed(2)}</td>
                  <td>{s.totalRatings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
