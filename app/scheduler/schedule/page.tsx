"use client";

import { useEffect, useState } from "react";
import SchedulerSidebar from "@/app/components/sidebars/SchedulerSidebar";
import useRoleGuard from "@/app/hooks/useRoleGuard";

type TabMode = "create" | "view" | "update" | "delete";

interface RouteOption {
  route_id: number;
  source_airport_code: string;
  destination_airport_code: string;
  approved_capacity: number;
}

interface AircraftOption {
  registration_number: string;
  model: string;
  aircraft_company: string;
  capacity: number;
  status: string;
}

interface Flight {
  flight_number: string;
  route_id: number;
  date: string; // "YYYY-MM-DD"
  scheduled_departure_time: string; // "HH:MM:SS" or "HH:MM"
  scheduled_arrival_time: string;
  aircraft_registration: string;
}

export default function ScheduleFlightPage() {
  useRoleGuard(["scheduler"]);

  const [activeTab, setActiveTab] = useState<TabMode>("create");

  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [aircrafts, setAircrafts] = useState<AircraftOption[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);

  // ---------- CREATE FORM STATE ----------
  const [routeId, setRouteId] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [aircraft, setAircraft] = useState("");
  const [date, setDate] = useState("");
  const [remarks, setRemarks] = useState("");

  // ---------- UPDATE FORM STATE ----------
  const [editRouteId, setEditRouteId] = useState("");
  const [editFlightNumber, setEditFlightNumber] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editDepartureTime, setEditDepartureTime] = useState("");
  const [editArrivalTime, setEditArrivalTime] = useState("");
  const [editAircraft, setEditAircraft] = useState("");
  const [editOriginalDate, setEditOriginalDate] = useState<string | null>(null);

  // -------------------------------------------------
  // LOAD ROUTES, AIRCRAFTS, FLIGHTS
  // -------------------------------------------------
  useEffect(() => {
    async function loadRoutes() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/scheduler/routes`,
          { credentials: "include" }
        );
        if (res.ok) {
          const data = await res.json();
          setRoutes(data);
        }
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
        if (res.ok) {
          const data = await res.json();
          setAircrafts(data);
        }
      } catch (e) {
        console.error("Failed to load aircrafts:", e);
      }
    }

    async function loadFlights() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/scheduler/flights`,
          { credentials: "include" }
        );
        if (res.ok) {
          const data = await res.json();
          setFlights(data);
        }
      } catch (e) {
        console.error("Failed to load flights:", e);
      }
    }

    loadRoutes();
    loadAircrafts();
    loadFlights();
  }, []);

  const refreshFlights = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/scheduler/flights`,
        { credentials: "include" }
      );
      if (res.ok) {
        const data = await res.json();
        setFlights(data);
      }
    } catch (e) {
      console.error("Failed to refresh flights:", e);
    }
  };

  // -------------------------------------------------
  // FRONTEND VALIDATION HELPERS
  // -------------------------------------------------
  const validateDateTime = (d: string, dep: string, arr: string): string | null => {
    if (!d || !dep || !arr) return "All date/time fields are required.";

    const depDT = new Date(`${d}T${dep}`);
    const arrDT = new Date(`${d}T${arr}`);
    const now = new Date();

    if (depDT < now) {
      return "Departure time cannot be in the past.";
    }
    if (arrDT <= depDT) {
      return "Arrival time must be after departure time.";
    }
    return null;
  };

  // -------------------------------------------------
  // CREATE FLIGHT
  // -------------------------------------------------
  const handleCreate = async () => {
    if (!routeId || !flightNumber || !date || !departureTime || !arrivalTime || !aircraft) {
      alert("Please fill all required fields!");
      return;
    }

    const timeError = validateDateTime(date, departureTime, arrivalTime);
    if (timeError) {
      alert(timeError);
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
        alert("Flight scheduled successfully!");
        await refreshFlights();
        setRouteId("");
        setFlightNumber("");
        setDate("");
        setDepartureTime("");
        setArrivalTime("");
        setAircraft("");
        setRemarks("");
      } else {
        const err = await res.json();
        alert(err.detail || "Failed to schedule flight.");
      }
    } catch (e) {
      console.error("Error scheduling flight:", e);
      alert("Network error");
    }
  };

  // -------------------------------------------------
  // PREPARE UPDATE FORM
  // -------------------------------------------------
  const startEdit = (flight: Flight) => {
    setEditFlightNumber(flight.flight_number);
    setEditRouteId(String(flight.route_id));
    setEditDate(flight.date);
    setEditDepartureTime(flight.scheduled_departure_time.slice(0, 5));
    setEditArrivalTime(flight.scheduled_arrival_time.slice(0, 5));
    setEditAircraft(flight.aircraft_registration);
    setEditOriginalDate(flight.date);
    setActiveTab("update");
  };

  // -------------------------------------------------
  // UPDATE FLIGHT
  // -------------------------------------------------
  const handleUpdate = async () => {
    if (
      !editFlightNumber ||
      !editRouteId ||
      !editDate ||
      !editDepartureTime ||
      !editArrivalTime ||
      !editAircraft ||
      !editOriginalDate
    ) {
      alert("Please select a flight and fill all fields.");
      return;
    }

    const timeError = validateDateTime(editDate, editDepartureTime, editArrivalTime);
    if (timeError) {
      alert(timeError);
      return;
    }

    const body = {
      route_id: Number(editRouteId),
      date: editDate,
      scheduled_departure_time: editDepartureTime,
      scheduled_arrival_time: editArrivalTime,
      aircraft_registration: editAircraft,
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/scheduler/flights/${editFlightNumber}?flight_date=${editOriginalDate}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (res.ok) {
        alert("Flight updated successfully!");
        await refreshFlights();
        // Keep in update tab; optional: clear form
      } else {
        const err = await res.json();
        alert(err.detail || "Failed to update flight.");
      }
    } catch (e) {
      console.error("Error updating flight:", e);
      alert("Network error");
    }
  };

  // -------------------------------------------------
  // DELETE FLIGHT
  // -------------------------------------------------
  const handleDelete = async (flight: Flight) => {
    const ok = confirm(
      `Are you sure you want to delete flight ${flight.flight_number} on ${flight.date}?`
    );
    if (!ok) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/scheduler/flights/${flight.flight_number}?flight_date=${flight.date}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.status === 204) {
        alert("Flight deleted successfully.");
        await refreshFlights();
      } else {
        const err = await res.json();
        alert(err.detail || "Failed to delete flight.");
      }
    } catch (e) {
      console.error("Error deleting flight:", e);
      alert("Network error");
    }
  };

  // -------------------------------------------------
  // HELPERS
  // -------------------------------------------------
  const findRouteLabel = (route_id: number) => {
    const r = routes.find((rt) => rt.route_id === route_id);
    if (!r) return route_id;
    return `${r.source_airport_code} → ${r.destination_airport_code}`;
  };

  const formatTime = (t: string) => t?.slice(0, 5); // "HH:MM"

  // -------------------------------------------------
  // RENDER
  // -------------------------------------------------
  return (
    <div className="flex min-h-screen">
      <SchedulerSidebar />

      <div className="flex-1 bg-gray-100 p-10">
        <h1 className="text-3xl font-bold text-black mb-2">
          Schedule a Flight
        </h1>
        <p className="text-gray-600 mb-8">
          Create, view, update, or delete flights.
        </p>

        {/* TABS */}
        <div className="flex space-x-4 mb-8">
          {(["create", "view", "update", "delete"] as TabMode[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-semibold border ${
                activeTab === tab
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-black hover:bg-gray-200"
              }`}
            >
              {tab === "create" && "Create Flight"}
              {tab === "view" && "View Flights"}
              {tab === "update" && "Update Flight"}
              {tab === "delete" && "Delete Flight"}
            </button>
          ))}
        </div>

        {/* ---------- CREATE TAB ---------- */}
        {activeTab === "create" && (
          <>
            <div className="grid grid-cols-2 gap-10 max-w-4xl">
              {/* Route Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-black">
                  Route
                </label>
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
                <label className="block text-sm font-semibold text-black">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 mt-2 border rounded-md bg-white text-black"
                />
              </div>

              {/* Departure Time */}
              <div>
                <label className="block text-sm font-semibold text-black">
                  Departure Time
                </label>
                <input
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full p-2 mt-2 border rounded-md bg-white text-black"
                />
              </div>

              {/* Arrival Time */}
              <div>
                <label className="block text-sm font-semibold text-black">
                  Arrival Time
                </label>
                <input
                  type="time"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="w-full p-2 mt-2 border rounded-md bg-white text-black"
                />
              </div>

              {/* Flight Number */}
              <div>
                <label className="block text-sm font-semibold text-black">
                  Flight Number
                </label>
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
                <label className="block text-sm font-semibold text-black">
                  Aircraft
                </label>
                <select
                  value={aircraft}
                  onChange={(e) => setAircraft(e.target.value)}
                  className="w-full p-2 mt-2 border rounded-md bg-white text-black"
                >
                  <option value="">Select Aircraft</option>
                  {aircrafts.map((a) => (
                    <option
                      key={a.registration_number}
                      value={a.registration_number}
                    >
                      {a.registration_number} ({a.model})
                    </option>
                  ))}
                </select>
              </div>

              {/* Remarks */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-black">
                  Remarks
                </label>
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
                onClick={handleCreate}
                className="bg-red-500 text-white px-8 py-2 rounded-md hover:bg-red-600 transition"
              >
                Save
              </button>

              <button
                className="border border-gray-400 text-black px-8 py-2 rounded-md hover:bg-gray-300 transition"
                onClick={() => {
                  setRouteId("");
                  setFlightNumber("");
                  setDate("");
                  setDepartureTime("");
                  setArrivalTime("");
                  setAircraft("");
                  setRemarks("");
                }}
              >
                CANCEL
              </button>
            </div>
          </>
        )}

        {/* ---------- VIEW / DELETE TABLE ---------- */}
        {(activeTab === "view" || activeTab === "delete") && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-black mb-4">
              Flights List
            </h2>

            <div className="overflow-x-auto bg-white rounded-lg shadow border">
              <table className="min-w-full text-sm text-left text-black">
                <thead className="bg-gray-100 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-2 border-b">Flight #</th>
                    <th className="px-4 py-2 border-b">Date</th>
                    <th className="px-4 py-2 border-b">Route</th>
                    <th className="px-4 py-2 border-b">Departure</th>
                    <th className="px-4 py-2 border-b">Arrival</th>
                    <th className="px-4 py-2 border-b">Aircraft</th>
                    {activeTab === "delete" && (
                      <th className="px-4 py-2 border-b text-center">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {flights.length === 0 && (
                    <tr>
                      <td
                        colSpan={activeTab === "delete" ? 7 : 6}
                        className="px-4 py-4 text-center text-gray-500"
                      >
                        No flights found.
                      </td>
                    </tr>
                  )}

                  {flights.map((f) => (
                    <tr key={`${f.flight_number}-${f.date}`} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{f.flight_number}</td>
                      <td className="px-4 py-2 border-b">{f.date}</td>
                      <td className="px-4 py-2 border-b">
                        {findRouteLabel(f.route_id)}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {formatTime(f.scheduled_departure_time)}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {formatTime(f.scheduled_arrival_time)}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {f.aircraft_registration}
                      </td>
                      {activeTab === "delete" && (
                        <td className="px-4 py-2 border-b text-center">
                          <button
                            onClick={() => handleDelete(f)}
                            className="px-3 py-1 text-xs rounded-md bg-red-500 text-white hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ---------- UPDATE TAB (TABLE + FORM) ---------- */}
        {activeTab === "update" && (
          <div className="mt-6 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-black mb-4">
                Select a flight to edit
              </h2>

              <div className="overflow-x-auto bg-white rounded-lg shadow border">
                <table className="min-w-full text-sm text-left text-black">
                  <thead className="bg-gray-100 text-xs uppercase">
                    <tr>
                      <th className="px-4 py-2 border-b">Flight #</th>
                      <th className="px-4 py-2 border-b">Date</th>
                      <th className="px-4 py-2 border-b">Route</th>
                      <th className="px-4 py-2 border-b">Departure</th>
                      <th className="px-4 py-2 border-b">Arrival</th>
                      <th className="px-4 py-2 border-b">Aircraft</th>
                      <th className="px-4 py-2 border-b text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flights.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-4 text-center text-gray-500"
                        >
                          No flights found.
                        </td>
                      </tr>
                    )}

                    {flights.map((f) => (
                      <tr key={`${f.flight_number}-${f.date}`} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b">{f.flight_number}</td>
                        <td className="px-4 py-2 border-b">{f.date}</td>
                        <td className="px-4 py-2 border-b">
                          {findRouteLabel(f.route_id)}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {formatTime(f.scheduled_departure_time)}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {formatTime(f.scheduled_arrival_time)}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {f.aircraft_registration}
                        </td>
                        <td className="px-4 py-2 border-b text-center">
                          <button
                            onClick={() => startEdit(f)}
                            className="px-3 py-1 text-xs rounded-md bg-black text-white hover:bg-gray-800"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* EDIT FORM */}
            <div>
              <h2 className="text-xl font-semibold text-black mb-4">
                Edit Flight Details
              </h2>

              <div className="grid grid-cols-2 gap-10 max-w-4xl">
                {/* Flight Number (read-only) */}
                <div>
                  <label className="block text-sm font-semibold text-black">
                    Flight Number
                  </label>
                  <input
                    type="text"
                    value={editFlightNumber}
                    disabled
                    className="w-full p-2 mt-2 border rounded-md bg-gray-200 text-black cursor-not-allowed"
                  />
                </div>

                {/* Route */}
                <div>
                  <label className="block text-sm font-semibold text-black">
                    Route
                  </label>
                  <select
                    value={editRouteId}
                    onChange={(e) => setEditRouteId(e.target.value)}
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
                  <label className="block text-sm font-semibold text-black">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full p-2 mt-2 border rounded-md bg-white text-black"
                  />
                </div>

                {/* Departure Time */}
                <div>
                  <label className="block text-sm font-semibold text-black">
                    Departure Time
                  </label>
                  <input
                    type="time"
                    value={editDepartureTime}
                    onChange={(e) => setEditDepartureTime(e.target.value)}
                    className="w-full p-2 mt-2 border rounded-md bg-white text-black"
                  />
                </div>

                {/* Arrival Time */}
                <div>
                  <label className="block text-sm font-semibold text-black">
                    Arrival Time
                  </label>
                  <input
                    type="time"
                    value={editArrivalTime}
                    onChange={(e) => setEditArrivalTime(e.target.value)}
                    className="w-full p-2 mt-2 border rounded-md bg-white text-black"
                  />
                </div>

                {/* Aircraft */}
                <div>
                  <label className="block text-sm font-semibold text-black">
                    Aircraft
                  </label>
                  <select
                    value={editAircraft}
                    onChange={(e) => setEditAircraft(e.target.value)}
                    className="w-full p-2 mt-2 border rounded-md bg-white text-black"
                  >
                    <option value="">Select Aircraft</option>
                    {aircrafts.map((a) => (
                      <option
                        key={a.registration_number}
                        value={a.registration_number}
                      >
                        {a.registration_number} ({a.model})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex mt-10 space-x-5">
                <button
                  onClick={handleUpdate}
                  className="bg-black text-white px-8 py-2 rounded-md hover:bg-gray-800 transition"
                >
                  Update
                </button>

                <button
                  className="border border-gray-400 text-black px-8 py-2 rounded-md hover:bg-gray-300 transition"
                  onClick={() => {
                    setEditFlightNumber("");
                    setEditRouteId("");
                    setEditDate("");
                    setEditDepartureTime("");
                    setEditArrivalTime("");
                    setEditAircraft("");
                    setEditOriginalDate(null);
                  }}
                >
                  CLEAR
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
