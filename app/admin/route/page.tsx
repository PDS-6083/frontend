"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/app/components/sidebars/AdminSidebar";
import useRoleGuard from "@/app/hooks/useRoleGuard";

export default function CreateRoutePage() {
  useRoleGuard(["admin"]);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [capacity, setCapacity] = useState("");
  const [remarks, setRemarks] = useState("");

  // List of airports from backend
  const [airports, setAirports] = useState<
    { code: string; name: string }[]
  >([]);

  // Load airports from backend
  useEffect(() => {
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
      } catch (error) {
        console.error("Failed to load airports:", error);
      }
    }

    loadAirports();
  }, []);

  // Save Route
  const handleSave = async () => {
    if (!source || !destination || !capacity) {
      alert("Please fill all required fields");
      return;
    }

    if (source === destination) {
      alert("Source and Destination cannot be the same");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/route`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source_airport_code: source,
            destination_airport_code: destination,
            approved_capacity: Number(capacity),
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || "Failed to create route");
        return;
      }

      alert("Route created successfully!");
      setSource("");
      setDestination("");
      setCapacity("");
      setRemarks("");
    } catch (error) {
      console.error("Route creation failed:", error);
      alert("Network error");
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <div className="flex-1 bg-gray-100 p-10">
        <h1 className="text-3xl font-bold text-black">Create Route</h1>
        <p className="text-gray-600 mb-10">
          Please select source airport and destination from the dropdown.
        </p>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-10 max-w-4xl">

          {/* Source Airport */}
          <div>
            <label className="block text-sm font-semibold text-black">
              Source Airport
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            >
              <option value="">Select Source</option>
              {airports.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.code} ({a.name})
                </option>
              ))}
            </select>
          </div>

          {/* Destination Airport */}
          <div>
            <label className="block text-sm font-semibold text-black">
              Destination Airport
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            >
              <option value="">Select Destination</option>
              {airports.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.code} ({a.name})
                </option>
              ))}
            </select>
          </div>

          {/* Approved Capacity */}
          <div>
            <label className="block text-sm font-semibold text-black">
              Approved Capacity
            </label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
              placeholder="Enter Approved Capacity"
            />
          </div>

          {/* Remarks */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-black">
              Enter Remarks
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full h-28 p-3 mt-2 border rounded-md bg-white text-black"
              placeholder="Optional remarks"
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex mt-10 space-x-5">
          <button
            onClick={handleSave}
            className="bg-red-500 text-white px-8 py-2 rounded-md hover:bg-red-600"
          >
            Save
          </button>

          <button
            className="border border-gray-400 text-black px-8 py-2 rounded-md hover:bg-gray-300"
            onClick={() => window.location.reload()}
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
