"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CrewSidebar from "../../components/sidebars/CrewSidebar";

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

type NextFlightInfo = CrewFlightSummary & {
  time_until_departure_minutes: number;
};

type CrewDashboardStats = {
  total_hours_completed: number;
  next_flight: NextFlightInfo | null;
};

type CrewDashboardResponse = {
  upcoming_flights: CrewFlightSummary[];
  stats: CrewDashboardStats;
};

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!Number.isFinite(minutes) || minutes <= 0) return "—";
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export default function CrewDashboard() {
  const [flights, setFlights] = useState<CrewFlightSummary[]>([]);
  const [stats, setStats] = useState<CrewDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch("http://localhost:8000/api/crew/dashboard", {
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
        setFlights(data.upcoming_flights || []);
        setStats(data.stats);
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

        {/* Optional stats bar using backend stats */}
        {stats && (
          <div className="mb-4 grid gap-4 md:grid-cols-3">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="text-xs font-semibold uppercase text-gray-500">
                Total Hours Completed
              </div>
              <div className="mt-2 text-2xl font-bold text-black">
                {stats.total_hours_completed.toFixed(1)}h
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="text-xs font-semibold uppercase text-gray-500">
                Next Flight
              </div>
              <div className="mt-2 text-sm text-black">
                {stats.next_flight
                  ? `${stats.next_flight.flight_number} · ${
                      stats.next_flight.source_airport_code
                    } → ${stats.next_flight.destination_airport_code}`
                  : "No upcoming flight"}
              </div>
              {stats.next_flight && (
                <div className="text-xs text-gray-600 mt-1">
                  Departs in{" "}
                  {formatDuration(stats.next_flight.time_until_departure_minutes)}
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

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          {loading && <p className="text-gray-600 text-sm">Loading flights...</p>}

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
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm text-gray-800">
                  <thead>
                    <tr className="border-b text-xs uppercase text-gray-500">
                      <th className="py-2 pr-4">Flight</th>
                      <th className="py-2 pr-4">Reg</th>
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Route</th>
                      <th className="py-2 pr-4">Departure</th>
                      <th className="py-2 pr-4">Hours</th>
                      <th className="py-2 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flights.map((f) => {
                      const id = `${f.flight_number}-${f.date}`;
                      const route = `${f.source_airport_code} → ${f.destination_airport_code}`;
                      const dep =
                        f.scheduled_departure_time?.slice(0, 5) || "--:--";
                      return (
                        <tr key={id} className="border-b last:border-none">
                          <td className="py-2 pr-4 text-black">
                            {f.flight_number}
                          </td>
                          <td className="py-2 pr-4 text-black">
                            {f.aircraft_registration}
                          </td>
                          <td className="py-2 pr-4 text-black">
                            {new Date(f.date).toLocaleDateString()}
                          </td>
                          <td className="py-2 pr-4 text-black">{route}</td>
                          <td className="py-2 pr-4 text-black">{dep}</td>
                          <td className="py-2 pr-4 text-black">
                            {formatDuration(f.duration_minutes)}
                          </td>
                          <td className="py-2 pr-4 text-right">
                            <Link
                              href={`/crew/flights/${encodeURIComponent(id)}`}
                              className="border border-black px-3 py-1 rounded-full text-xs text-black hover:bg-black hover:text-white transition"
                            >
                              Details
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* dynamic footer */}
              <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
                <div>Showing {flights.length} flights</div>
                <div className="space-x-2">
                  {/* keep buttons purely visual for now */}
                  <button className="rounded-md border border-gray-300 px-2 py-1">
                    1
                  </button>
                  <button className="rounded-md border border-gray-300 px-2 py-1">
                    2
                  </button>
                  <button className="rounded-md border border-gray-300 px-2 py-1">
                    3
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}