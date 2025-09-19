
// Owner.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "../components/UI.jsx";

export default function Owner() {
  const [data, setData] = useState({ stores: [] });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await axios.get("/owner/dashboard");
    setData(data);
  }

  return (
    <div className="container-lg">
      <div className="dashboard-section">
        <div className="mb-6">
          <h2 className="heading">Owner Dashboard</h2>
          <p className="text-muted">
            Manage your stores and view customer ratings
          </p>
        </div>

        {data.stores.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <h3>No Stores Found</h3>
              <p className="text-muted">
                You don't have any stores assigned to your account yet.
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid" style={{ gap: "1.5rem" }}>
            {data.stores.map((s) => (
              <Card key={s.storeId}>
                <div className="card-header">
                  <h3 className="card-title">{s.storeName}</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {Number(s.averageRating).toFixed(2)}
                    </div>
                    <div className="text-sm text-muted">
                      Average ({s.count} {s.count === 1 ? "rating" : "ratings"})
                    </div>
                  </div>
                </div>

                {s.ratings.length > 0 ? (
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Email</th>
                          <th className="text-center">Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {s.ratings.map((r) => (
                          <tr key={r.userId}>
                            <td>{r.name}</td>
                            <td>{r.email}</td>
                            <td className="text-center">
                              <span className="font-medium text-primary">
                                ★ {r.rating}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted">No ratings yet for this store.</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
