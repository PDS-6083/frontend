"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/app/components/sidebars/AdminSidebar";
import useRoleGuard from "@/app/hooks/useRoleGuard";

export default function RouteManagementPage() {
  useRoleGuard(["admin"]);

  const [tab, setTab] = useState<"create" | "update" | "view" | "delete">("create");

  // Store all routes + airport codes
  const [routes, setRoutes] = useState([]);
  const [airports, setAirports] = useState<{ code: string; name: string }[]>([]);

  // Load airports + routes on mount
  useEffect(() => {
    loadRoutes();
    loadAirports();
  }, []);

  async function loadAirports() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/airport`,
        { credentials: "include" }
      );

      if (res.ok) {
        const data = await res.json();
        setAirports(
          data.map((a: any) => ({
            code: a.airport_code,
            name: a.airport_name,
          }))
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function loadRoutes() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/route`,
        { credentials: "include" }
      );

      if (res.ok) setRoutes(await res.json());
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1 bg-gray-100 p-10 text-black">
        <h1 className="text-3xl font-bold mb-6">Route Management</h1>

        {/* TAB BUTTONS */}
        <div className="flex space-x-4 mb-8">
          {["create", "update", "view", "delete"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className={`px-6 py-2 rounded-md text-white 
                ${tab === t ? "bg-black" : "bg-gray-700 hover:bg-black"}`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        {tab === "create" && (
          <CreateRouteForm airports={airports} reload={loadRoutes} />
        )}

        {tab === "view" && <RouteTable routes={routes} />}

        {tab === "delete" && (
          <DeleteRouteForm routes={routes} reload={loadRoutes} />
        )}

        {tab === "update" && (
          <UpdateRouteForm
            routes={routes}
            airports={airports}
            reload={loadRoutes}
          />
        )}
      </div>
    </div>
  );
}

/* -------------------------
   CREATE ROUTE COMPONENT
-------------------------- */
function CreateRouteForm({ airports, reload }: any) {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [capacity, setCapacity] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleSave = async () => {
    if (!source || !destination || !capacity) {
      return alert("Please fill all required fields");
    }
    if (source === destination) {
      return alert("Source and Destination cannot be the same");
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/route`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_airport_code: source,
          destination_airport_code: destination,
          approved_capacity: Number(capacity),
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) return alert(data.detail);
    alert("Route created!");
    reload();
    setSource("");
    setDestination("");
    setCapacity("");
    setRemarks("");
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-3xl">
      <h2 className="text-xl font-semibold mb-4">Create Route</h2>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="font-semibold">Source Airport</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full p-2 border rounded mt-2 bg-white"
          >
            <option value="">Select Source</option>
            {airports.map((a: any) => (
              <option value={a.code} key={a.code}>
                {a.code} ({a.name})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold">Destination Airport</label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full p-2 border rounded mt-2 bg-white"
          >
            <option value="">Select Destination</option>
            {airports.map((a: any) => (
              <option value={a.code} key={a.code}>
                {a.code} ({a.name})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold">Approved Capacity</label>
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="w-full p-2 border rounded mt-2 bg-white"
            placeholder="Capacity"
          />
        </div>

        <div className="col-span-2">
          <label className="font-semibold">Remarks</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full p-3 border rounded mt-2 bg-white"
            placeholder="Optional remarks..."
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="mt-6 bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
      >
        Save
      </button>
    </div>
  );
}

/* -------------------------
   VIEW ROUTES TABLE
-------------------------- */
function RouteTable({ routes }: any) {
  return (
    <div className="bg-white p-6 rounded shadow overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">All Routes</h2>

      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Route ID</th>
            <th className="border p-2">Source</th>
            <th className="border p-2">Destination</th>
            <th className="border p-2">Capacity</th>
          </tr>
        </thead>

        <tbody>
          {routes.map((r: any) => (
            <tr key={r.route_id}>
              <td className="border p-2">{r.route_id}</td>
              <td className="border p-2">{r.source_airport_code}</td>
              <td className="border p-2">{r.destination_airport_code}</td>
              <td className="border p-2">{r.approved_capacity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------------
   DELETE ROUTE
-------------------------- */
function DeleteRouteForm({ routes, reload }: any) {
  const [id, setId] = useState("");

  const handleDelete = async () => {
    if (!id) return alert("Select a route");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/route/delete`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ route_id: Number(id) }),
      }
    );

    const data = await res.json();
    if (!res.ok) return alert(data.detail);

    alert("Route deleted!");
    reload();
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-lg">
      <h2 className="text-xl font-semibold mb-4">Delete Route</h2>

      <select
        className="border p-2 rounded w-64"
        onChange={(e) => setId(e.target.value)}
      >
        <option value="">Select Route</option>
        {routes.map((r: any) => (
          <option value={r.route_id} key={r.route_id}>
            #{r.route_id} · {r.source_airport_code} → {r.destination_airport_code}
          </option>
        ))}
      </select>

      <button
        onClick={handleDelete}
        className="ml-4 bg-red-600 text-white px-6 py-2 rounded"
      >
        Delete
      </button>
    </div>
  );
}

/* -------------------------
   UPDATE ROUTE
-------------------------- */
function UpdateRouteForm({ routes, airports, reload }: any) {
  const [id, setId] = useState("");

  const [form, setForm] = useState({
    source: "",
    destination: "",
    capacity: "",
  });

  // When user selects a route, fill form
  useEffect(() => {
    const r = routes.find((x: any) => x.route_id == id);
    if (r) {
      setForm({
        source: r.source_airport_code,
        destination: r.destination_airport_code,
        capacity: r.approved_capacity,
      });
    }
  }, [id]);

  const handleUpdate = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/route/update`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          route_id: Number(id),
          source_airport_code: form.source,
          destination_airport_code: form.destination,
          approved_capacity: Number(form.capacity),
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) return alert(data.detail);

    alert("Route updated!");
    reload();
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Update Route</h2>

      {/* SELECT ROUTE */}
      <select
        className="border p-2 rounded w-64 mb-4"
        onChange={(e) => setId(e.target.value)}
      >
        <option value="">Select Route</option>
        {routes.map((r: any) => (
          <option value={r.route_id} key={r.route_id}>
            #{r.route_id} · {r.source_airport_code} → {r.destination_airport_code}
          </option>
        ))}
      </select>

      {id && (
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="font-semibold">Source</label>
            <select
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              className="w-full p-2 border rounded mt-1 bg-white"
            >
              {airports.map((a: any) => (
                <option key={a.code} value={a.code}>
                  {a.code} ({a.name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold">Destination</label>
            <select
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
              className="w-full p-2 border rounded mt-1 bg-white"
            >
              {airports.map((a: any) => (
                <option key={a.code} value={a.code}>
                  {a.code} ({a.name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold">Capacity</label>
            <input
              type="number"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              className="w-full p-2 border rounded mt-1 bg-white"
            />
          </div>
        </div>
      )}

      <button
        onClick={handleUpdate}
        className="mt-6 bg-black text-white px-6 py-2 rounded"
      >
        Update
      </button>
    </div>
  );
}
