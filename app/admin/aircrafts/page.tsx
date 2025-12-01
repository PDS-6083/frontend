
"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/app/components/sidebars/AdminSidebar";

import useRoleGuard from "@/app/hooks/useRoleGuard";

export default function AddAircraftPage() {

  useRoleGuard(["admin"]);
  const [tab, setTab] = useState<"create" | "update" | "view" | "delete">("create");
  const [aircrafts, setAircrafts] = useState([]);

  // Load all aircrafts for LIST, UPDATE, DELETE
  async function loadAircrafts() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/aircraft`, {
      credentials: "include",
    });
    if (res.ok) setAircrafts(await res.json());
  }

  useEffect(() => {
    loadAircrafts();
  }, []);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1 bg-gray-100 p-10 text-black">

        {/* PAGE TITLE */}
        <h1 className="text-3xl font-bold mb-6">Aircraft Management</h1>

        {/* --- TABS --- */}
        <div className="flex space-x-4 mb-8">
          {["create","update","view","delete"].map((t) => (
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

        {/* --- TAB CONTENT --- */}

        {tab === "create" && <CreateAircraftForm />}

        {tab === "view" && <AircraftList aircrafts={aircrafts} />}

        {tab === "delete" && (
          <DeleteAircraftForm aircrafts={aircrafts} reload={loadAircrafts} />
        )}

        {tab === "update" && (
          <UpdateAircraftForm aircrafts={aircrafts} reload={loadAircrafts} />
        )}

      </div>
    </div>
  );
}

/* ------------------------
   CREATE AIRCRAFT FORM
------------------------- */
function CreateAircraftForm() {
  const [form, setForm] = useState({
    registration_number: "",
    aircraft_company: "",
    model: "",
    capacity: "",
    status: "active",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/aircraft`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, capacity: Number(form.capacity) }),
    });

    const data = await res.json();
    if (res.ok) alert("Aircraft Added!");
    else alert(data.detail);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow">
      <h2 className="text-xl font-semibold mb-4">Create Aircraft</h2>

      <div className="grid grid-cols-2 gap-4">
        <input
          className="border p-2 rounded"
          placeholder="Registration Number"
          value={form.registration_number}
          onChange={(e) => setForm({ ...form, registration_number: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Company"
          value={form.aircraft_company}
          onChange={(e) => setForm({ ...form, aircraft_company: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Model"
          value={form.model}
          onChange={(e) => setForm({ ...form, model: e.target.value })}
        />
        <input
          className="border p-2 rounded"
          placeholder="Capacity"
          value={form.capacity}
          onChange={(e) => setForm({ ...form, capacity: e.target.value })}
        />

        <select
          className="border p-2 rounded"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="active">Active</option>
          <option value="maintenance">Maintenance</option>
          <option value="retired">Retired</option>
        </select>
      </div>

      <button className="mt-4 bg-black text-white px-6 py-2 rounded-md">
        Save
      </button>
    </form>
  );
}

/* ------------------------
   VIEW LIST
------------------------- */
function AircraftList({ aircrafts }: any) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">All Aircrafts</h2>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Reg No</th>
            <th className="p-2 border">Company</th>
            <th className="p-2 border">Model</th>
            <th className="p-2 border">Capacity</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {aircrafts.map((a: any) => (
            <tr key={a.registration_number}>
              <td className="p-2 border">{a.registration_number}</td>
              <td className="p-2 border">{a.aircraft_company}</td>
              <td className="p-2 border">{a.model}</td>
              <td className="p-2 border">{a.capacity}</td>
              <td className="p-2 border">{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------
   DELETE AIRCRAFT
------------------------- */
function DeleteAircraftForm({ aircrafts, reload }: any) {
  const [selected, setSelected] = useState("");

  const handleDelete = async () => {
    if (!selected) return alert("Select an aircraft");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/aircraft/delete`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registration_number: selected }),
      }
    );

    const data = await res.json();
    if (res.ok) {
      alert("Deleted!");
      reload();
    } else alert(data.detail);
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Delete Aircraft</h2>

      <select
        className="border p-2 rounded w-64"
        onChange={(e) => setSelected(e.target.value)}
      >
        <option value="">Select Aircraft</option>
        {aircrafts.map((a: any) => (
          <option key={a.registration_number} value={a.registration_number}>
            {a.registration_number}
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

/* ------------------------
   UPDATE AIRCRAFT
------------------------- */
function UpdateAircraftForm({ aircrafts, reload }: any) {
  const [selected, setSelected] = useState("");
  const [form, setForm] = useState({ company: "", model: "", capacity: "" });

  const selectedAircraft = aircrafts.find(
    (a: any) => a.registration_number === selected
  );

  useEffect(() => {
    if (selectedAircraft) {
      setForm({
        company: selectedAircraft.aircraft_company,
        model: selectedAircraft.model,
        capacity: selectedAircraft.capacity,
      });
    }
  }, [selected]);

  const handleUpdate = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/aircraft/update`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        registration_number: selected,
        aircraft_company: form.company,
        model: form.model,
        capacity: Number(form.capacity),
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Updated!");
      reload();
    } else alert(data.detail);
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Update Aircraft</h2>

      {/* SELECT AIRCRAFT */}
      <select
        className="border p-2 rounded w-64 mb-4"
        onChange={(e) => setSelected(e.target.value)}
      >
        <option value="">Select Aircraft</option>
        {aircrafts.map((a: any) => (
          <option key={a.registration_number} value={a.registration_number}>
            {a.registration_number}
          </option>
        ))}
      </select>

      {selected && (
        <div className="grid grid-cols-2 gap-4">
          <input
            className="border p-2 rounded"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />

          <input
            className="border p-2 rounded"
            value={form.model}
            onChange={(e) => setForm({ ...form, model: e.target.value })}
          />

          <input
            className="border p-2 rounded"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: e.target.value })}
          />
        </div>
      )}

      <button
        onClick={handleUpdate}
        className="mt-4 bg-black text-white px-6 py-2 rounded-md"
      >
        Update
      </button>
    </div>
  );
}
