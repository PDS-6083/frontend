"use client";

import { useState } from "react";
import AdminSidebar from "@/app/components/sidebars/AdminSidebar";


export default function CreateRoutePage() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [capacity, setCapacity] = useState("");
  const [routeType, setRouteType] = useState("Domestic");
  const [remarks, setRemarks] = useState("");

  const airports = [
    { code: "IAD", name: "Washington" },
    { code: "LGA", name: "New York" },
    { code: "DXB", name: "Dubai" },
    { code: "JFK", name: "New York" },
    { code: "ORD", name: "Chicago" },
    { code: "LAX", name: "Los Angeles" },
    { code: "DFW", name: "Dallas" },
  ];

  const handleSave = () => {
    const routeData = {
      source,
      destination,
      capacity,
      routeType,
      remarks,
    };

    console.log("Route Data:", routeData);

    // Later: send to backend
    // axios.post("/api/route", routeData);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar/>

      {/* Main content */}
      <div className="flex-1 bg-gray-100 p-10">
        <h1 className="text-3xl font-bold text-black">Create Route</h1>
        <p className="text-gray-600 mb-10">
          Please select source airport and destination from the dropdown.
        </p>

        {/* Form Section */}
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
              {airports.map((a, idx) => (
                <option key={idx} value={a.code}>
                  {a.code} ({a.name})
                </option>
              ))}
            </select>
            {source && (
              <p className="text-xs text-gray-500 mt-1">ICAO: K{source}</p>
            )}
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
              {airports.map((a, idx) => (
                <option key={idx} value={a.code}>
                  {a.code} ({a.name})
                </option>
              ))}
            </select>
            {destination && (
              <p className="text-xs text-gray-500 mt-1">ICAO: K{destination}</p>
            )}
          </div>

          {/* Approved Capacity */}
          <div>
            <label className="block text-sm font-semibold text-black">
              Approved Capacity
            </label>
            <input
              type="number"
              placeholder="Enter Appr. Capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            />
          </div>

          {/* Route Type */}
          <div>
            <label className="block text-sm font-semibold text-black">
              Route Type
            </label>
            <select
              value={routeType}
              onChange={(e) => setRouteType(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            >
              <option value="Domestic">Domestic</option>
              <option value="International">International</option>
            </select>
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
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex mt-10 space-x-5">
          <button
            onClick={handleSave}
            className="bg-red-500 text-white px-8 py-2 rounded-md hover:bg-red-600"
          >
            Save
          </button>
          <button
  className="border border-gray-400 text-black px-8 py-2 rounded-md
             hover:bg-gray-300 hover:border-gray-500
             transition-all duration-200"
>
  CANCEL
</button>


        </div>
      </div>
    </div>
  );
}
