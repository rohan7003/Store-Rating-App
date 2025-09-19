
import { useEffect, useState } from "react";
import axios from "axios";
import Joi from "joi";
import { useAuth } from "../state/auth.jsx";
import { Card, Field, Input, Button, Select } from "../components/UI.jsx";

const rateSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
});

export default function Stores() {
  const { user } = useAuth();
  const [stores, setStores] = useState([]);
  const [query, setQuery] = useState({ name: "", address: "" });
  const [sort, setSort] = useState({ field: "name", dir: "ASC" });
  const [myRatings, setMyRatings] = useState({});

  useEffect(() => {
    load();
    if (user) loadMyRatings();
  }, [user]);

  async function load() {
    const { data } = await axios.get("/stores/list");
    setStores(data);
  }

  async function loadMyRatings() {
    try {
      const { data } = await axios.get("/stores/my-ratings");
      const map = {};
      data.forEach((r) => {
        map[r.storeId] = r.rating;
      });
      setMyRatings(map);
    } catch {}
  }

  async function search() {
    const params = new URLSearchParams();
    if (query.name) params.set("name", query.name);
    if (query.address) params.set("address", query.address);
    const { data } = await axios.get(`/stores/search?${params.toString()}`);
    setStores(data);
  }

  function sorted() {
    const s = [...stores];
    s.sort((a, b) => {
      const A = a[sort.field];
      const B = b[sort.field];
      if (A < B) return sort.dir === "ASC" ? -1 : 1;
      if (A > B) return sort.dir === "ASC" ? 1 : -1;
      return 0;
    });
    return s;
  }

  async function rate(storeId, value) {
    const { error } = rateSchema.validate({ rating: value });
    if (error) return alert(error.message);
    try {
      if (myRatings[storeId]) {
        await axios.post("/stores/update-rating", { storeId, rating: value });
      } else {
        await axios.post("/stores/rate", { storeId, rating: value });
      }
      setMyRatings((prev) => ({ ...prev, [storeId]: value }));
      await load();
    } catch (err) {
      alert(err.response?.data?.message || "Rating failed");
    }
  }

  return (
    <div className="container-lg">
      <Card>
        <div className="card-header">
          <h2 className="card-title">Browse Stores</h2>
          <Button onClick={search}>Search</Button>
        </div>

        {/* Search and Sort Controls */}
        <div className="filters-row">
          <Input
            placeholder="Search by name"
            value={query.name}
            onChange={(e) => setQuery({ ...query, name: e.target.value })}
          />
          <Input
            placeholder="Search by address"
            value={query.address}
            onChange={(e) => setQuery({ ...query, address: e.target.value })}
          />
          <Select
            value={sort.field}
            onChange={(e) => setSort({ ...sort, field: e.target.value })}
          >
            <option value="name">Name</option>
            <option value="address">Address</option>
            <option value="averageRating">Overall Rating</option>
          </Select>
          <Select
            value={sort.dir}
            onChange={(e) => setSort({ ...sort, dir: e.target.value })}
          >
            <option value="ASC">ASC</option>
            <option value="DESC">DESC</option>
          </Select>
        </div>

        {/* Stores Table */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th className="text-center">Overall</th>
                <th className="text-center">My Rating</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {sorted().map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="font-medium">{s.name}</div>
                  </td>
                  <td>{s.address || "-"}</td>
                  <td className="text-center">
                    <div className="font-medium text-primary">
                      {Number(s.averageRating).toFixed(2)}
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="font-medium">
                      {myRatings[s.id] ? (
                        <span className="text-success">
                          ★ {myRatings[s.id]}
                        </span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </div>
                  </td>
                  <td className="text-center">
                    {user ? (
                      <Select
                        value={myRatings[s.id] || ""}
                        onChange={(e) => rate(s.id, Number(e.target.value))}
                        style={{ minWidth: "100px" }}
                      >
                        <option value="">Rate</option>
                        {[1, 2, 3, 4, 5].map((v) => (
                          <option key={v} value={v}>
                            ★ {v}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <span className="text-muted text-sm">Login to rate</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {stores.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted">
              No stores found. Try adjusting your search criteria.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
