"use client";

import { useEffect, useState } from "react";
import SchedulerSidebar from "@/app/components/sidebars/SchedulerSidebar";
import useRoleGuard from "@/app/hooks/useRoleGuard";

export default function ScheduleFlightPage() {
  useRoleGuard(["scheduler"]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [aircrafts, setAircrafts] = useState<any[]>([]);

  const [routeId, setRouteId] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [aircraft, setAircraft] = useState("");
  const [date, setDate] = useState("");

  const [remarks, setRemarks] = useState("");

  // -------------------------------
  // Fetch routes + aircrafts
  // -------------------------------
  useEffect(() => {
    async function loadRoutes() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/scheduler/routes`,
          { credentials: "include" }
        );
        if (res.ok) setRoutes(await res.json());
      } catch (e) {
        console.error("Failed to load routes:", e);
      }
    }

    async function loadAircrafts() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/scheduler/aircrafts`,
          { credentials: "include" }
        );
        if (res.ok) setAircrafts(await res.json());
      } catch (e) {
        console.error("Failed to load aircrafts:", e);
      }
    }

    loadRoutes();
    loadAircrafts();
  }, []);

  // -------------------------------
  // SAVE FLIGHT (POST)
  // -------------------------------
  const handleSave = async () => {
    if (!routeId || !flightNumber || !date || !departureTime || !arrivalTime || !aircraft) {
      alert("Please fill all required fields!");
      return;
    }

    const flightData = {
      flight_number: flightNumber,
      route_id: Number(routeId),
      date,
      scheduled_departure_time: departureTime,
      scheduled_arrival_time: arrivalTime,
      aircraft_registration: aircraft,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/scheduler/flights`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(flightData),
        }
      );

      if (res.ok) {
        alert("Flight Scheduled Successfully!");
      } else {
        const err = await res.json();
        alert(err.detail || "Failed to schedule flight.");
      }
    } catch (e) {
      console.error("Error scheduling flight:", e);
      alert("Network error");
    }
  };

  return (
    <div className="flex min-h-screen">
      <SchedulerSidebar />

      <div className="flex-1 bg-gray-100 p-10">
        <h1 className="text-3xl font-bold text-black">Schedule a Flight</h1>
        <p className="text-gray-600 mb-10">
          Please fill the following form to add a Flight to the system.
        </p>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-10 max-w-4xl">

          {/* Route Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-black">Route</label>
            <select
              value={routeId}
              onChange={(e) => setRouteId(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            >
              <option value="">Select Route</option>
              {routes.map((r) => (
                <option key={r.route_id} value={r.route_id}>
                  {r.source_airport_code} → {r.destination_airport_code}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-black">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            />
          </div>

          {/* Departure Time */}
          <div>
            <label className="block text-sm font-semibold text-black">Departure Time</label>
            <input
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            />
          </div>

          {/* Arrival Time */}
          <div>
            <label className="block text-sm font-semibold text-black">Arrival Time</label>
            <input
              type="time"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            />
          </div>

          {/* Flight Number */}
          <div>
            <label className="block text-sm font-semibold text-black">Flight Number</label>
            <input
              type="text"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
              placeholder="UA220"
            />
          </div>

          {/* Aircraft Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-black">Aircraft</label>
            <select
              value={aircraft}
              onChange={(e) => setAircraft(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            >
              <option value="">Select Aircraft</option>
              {aircrafts.map((a) => (
                <option key={a.registration_number} value={a.registration_number}>
                  {a.registration_number} ({a.model})
                </option>
              ))}
            </select>
          </div>

          {/* Remarks */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-black">Remarks</label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            />
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
