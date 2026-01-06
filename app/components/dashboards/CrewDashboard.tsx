"use client";

import { useEffect, useState } from "react";
import CrewSidebar from "@/app/components/sidebars/CrewSidebar";

type CrewFlightSummary = {
  flight_number: string;
  date: string;
  scheduled_departure_time: string;
  scheduled_arrival_time: string;
  duration_minutes: number;
  aircraft_registration: string;
  source_airport_code: string;
  destination_airport_code: string;
};

type CrewDashboardStats = {
  total_hours_completed: number;
  next_flight: {
    flight_number: string;
    date: string;
    scheduled_departure_time: string;
    scheduled_arrival_time: string;
    duration_minutes: number;
    aircraft_registration: string;
    source_airport_code: string;
    destination_airport_code: string;
    time_until_departure_minutes: number;
  } | null;
};

type CrewDashboardResponse = {
  upcoming_flights: CrewFlightSummary[];
  stats: CrewDashboardStats;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function formatDuration(minutes: number) {
  if (!Number.isFinite(minutes) || minutes <= 0) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m}m`;
  if (!m) return `${h}h`;
  return `${h}h ${m}m`;
}

// Helper to build a unique flight id (number + date)
function getFlightId(f: { flight_number: string; date: string }) {
  return `${f.flight_number}-${f.date}`;
}

export default function CrewDashboard() {
  const [flights, setFlights] = useState<CrewFlightSummary[]>([]);
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);
  const [stats, setStats] = useState<CrewDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedFlight =
    selectedFlightId != null
      ? flights.find((f) => getFlightId(f) === selectedFlightId) || null
      : null;

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/crew/dashboard`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            setError("You must be logged in as crew to view this page.");
          } else {
            setError(`Failed to load crew dashboard (${res.status})`);
          }
          return;
        }

        const data: CrewDashboardResponse = await res.json();
        const list = data.upcoming_flights || [];
        setFlights(list);
        setStats(data.stats || null);

        // default selection: first flight (if any)
        if (list.length > 0) {
          setSelectedFlightId(getFlightId(list[0]));
        } else {
          setSelectedFlightId(null);
        }
      } catch (e) {
        console.error(e);
        setError("Something went wrong while loading your flights.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="flex min-h-screen">
      <CrewSidebar />

      <div className="flex-1 bg-gray-100 p-10">
        <h1 className="text-3xl font-semibold mb-4 text-black">My Flights</h1>
        <p className="text-sm text-gray-600 mb-6">
          Upcoming flights assigned to you.
        </p>

        {/* STATS CARD */}
        {stats && (
          <div className="mb-4 grid gap-4 md:grid-cols-3">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="text-xs font-semibold uppercase text-gray-500">
                Total Hours Completed
              </div>
              <div className="mt-2 text-2xl font-bold text-black">
                {stats.total_hours_completed.toFixed(1)}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="text-xs font-semibold uppercase text-gray-500">
                Next Flight
              </div>
              <div className="mt-2 text-sm text-black">
                {stats.next_flight
                  ? `${stats.next_flight.flight_number} · ${stats.next_flight.source_airport_code} → ${stats.next_flight.destination_airport_code}`
                  : "No upcoming flight"}
              </div>
              {stats.next_flight && (
                <div className="text-xs text-gray-600 mt-1">
                  Departs in{" "}
                  {formatDuration(
                    stats.next_flight.time_until_departure_minutes
                  )}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="text-xs font-semibold uppercase text-gray-500">
                Upcoming Flights
              </div>
              <div className="mt-2 text-2xl font-bold text-black">
                {flights.length}
              </div>
            </div>
          </div>
        )}

        {loading && (
          <p className="text-gray-600 text-sm">Loading your flights…</p>
        )}

        {error && !loading && (
          <div className="mb-4 rounded-md bg-red-100 px-4 py-2 text-sm text-red-800">
            {error}
          </div>
        )}

        {!loading && !error && flights.length === 0 && (
          <p className="text-sm text-gray-600">No upcoming flights found.</p>
        )}

        {!loading && !error && flights.length > 0 && (
          <>
            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-gray-800">
                <thead>
                  <tr className="border-b text-xs uppercase text-gray-500">
                    <th className="py-2 pr-4">Flight</th>
                    <th className="py-2 pr-4">Reg</th>
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Route</th>
                    <th className="py-2 pr-4">Departure</th>
                    <th className="py-2 pr-4">Duration</th>
                    <th className="py-2 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {flights.map((f) => {
                    const id = getFlightId(f);
                    const isSelected = id === selectedFlightId;

                    return (
                      <tr
                        key={id}
                        className={`border-b last:border-none ${
                          isSelected ? "bg-gray-50" : ""
                        }`}
                      >
                        <td className="py-2 pr-4 text-black">
                          {f.flight_number}
                        </td>
                        <td className="py-2 pr-4 text-black">
                          {f.aircraft_registration}
                        </td>
                        <td className="py-2 pr-4 text-black">
                          {new Date(f.date).toLocaleDateString()}
                        </td>
                        <td className="py-2 pr-4 text-black">
                          {f.source_airport_code} →{" "}
                          {f.destination_airport_code}
                        </td>
                        <td className="py-2 pr-4 text-black">
                          {f.scheduled_departure_time.slice(0, 5)}
                        </td>
                        <td className="py-2 pr-4 text-black">
                          {formatDuration(f.duration_minutes)}
                        </td>
                        <td className="py-2 pr-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedFlightId(id)}
                            className="border border-black px-3 py-1 rounded-full text-xs text-black hover:bg-black hover:text-white transition"
                          >
                            {isSelected ? "Selected" : "Details"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* DETAILS PANEL */}
            {selectedFlight && (
              <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h2 className="text-lg font-semibold mb-3 text-black">
                  Flight Details – {selectedFlight.flight_number}
                </h2>
                <div className="grid gap-4 md:grid-cols-2 text-sm">
                  <div>
                    <div className="text-xs text-gray-500">Date</div>
                    <div className="font-medium text-black">
                      {new Date(selectedFlight.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Aircraft</div>
                    <div className="font-medium text-black">
                      {selectedFlight.aircraft_registration}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Route</div>
                    <div className="font-medium text-black">
                      {selectedFlight.source_airport_code} →{" "}
                      {selectedFlight.destination_airport_code}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Departure</div>
                    <div className="font-medium text-black">
                      {selectedFlight.scheduled_departure_time.slice(0, 5)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Arrival</div>
                    <div className="font-medium text-black">
                      {selectedFlight.scheduled_arrival_time.slice(0, 5)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Duration</div>
                    <div className="font-medium text-black">
                      {formatDuration(selectedFlight.duration_minutes)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}