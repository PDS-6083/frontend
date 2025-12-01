"use client";

import { useState } from "react";
import AdminSidebar from "@/app/components/sidebars/AdminSidebar";

export default function AddAircraftPage() {
  const [registration, setRegistration] = useState("");
  const [model, setModel] = useState("");
  const [capacity, setCapacity] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState("active");

  const handleSave = async () => {
    const payload = {
      registration_number: registration,
      aircraft_company: company,
      model,
      capacity: Number(capacity),
      status,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/aircraft`,
        {
          method: "POST",
          credentials: "include", // send auth cookie
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        alert(error.detail || "Failed to add aircraft");
        return;
      }

      alert("Aircraft added successfully!");
      setRegistration("");
      setModel("");
      setCapacity("");
      setCompany("");

    } catch (err) {
      console.error("Error:", err);
      alert("Network error");
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1 bg-gray-100 p-10">

        <h1 className="text-3xl font-bold text-black">Add Aircraft</h1>
        <p className="text-gray-600 mb-10">
          Please fill the following form to add an aircraft.
        </p>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-10 max-w-4xl">

          {/* Registration */}
          <div>
            <label className="block text-sm font-semibold text-black">
              Registration Number
            </label>
            <input
              type="text"
              value={registration}
              onChange={(e) => setRegistration(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
              placeholder="N176891"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-semibold text-black">
              Aircraft Company
            </label>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            >
              <option value="">Select Company</option>
              <option value="Boeing">Boeing</option>
              <option value="Airbus">Airbus</option>
              <option value="Embraer">Embraer</option>
            </select>
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-semibold text-black">
              Model
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
              placeholder="A320 / B737 / E195"
            />
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-semibold text-black">
              Capacity
            </label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
              placeholder="180"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-black">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            >
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="retired">Retired</option>
            </select>
          </div>

        </div>

        {/* BUTTONS */}
        <div className="flex mt-10 space-x-5">
          <button
            onClick={handleSave}
            className="bg-red-500 text-white px-8 py-2 rounded-md hover:bg-red-600 transition"
          >
            Save
          </button>

          <button className="border border-gray-400 text-black px-8 py-2 rounded-md hover:bg-gray-300 transition">
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
