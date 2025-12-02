"use client";

import { useEffect, useState } from "react";
import CrewSidebar from "../components/sidebars/CrewSidebar";
import Link from "next/link";

// Backend types
type CrewProfile = {
  email_id?: string; // depending on backend field names
  email?: string;
  name: string;
  phone?: string | null;
  is_pilot?: boolean;
};

type CrewFlightSummary = {
  flight_number: string;
  date: string;                     // ISO date
  scheduled_departure_time: string; // "HH:MM:SS"
  scheduled_arrival_time: string;   // "HH:MM:SS"
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function formatDuration(minutes: number) {
  if (!minutes || minutes <= 0) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m}m`;
  if (!m) return `${h}h`;
  return `${h}h ${m}m`;
}

export default function CrewHomePage() {
  const [profile, setProfile] = useState<CrewProfile | null>(null);
  const [dashboard, setDashboard] = useState<CrewDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [profileRes, dashboardRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/crew/me`, {
            credentials: "include",
          }),
          fetch(`${API_BASE_URL}/api/crew/dashboard`, {
            credentials: "include",
          }),
        ]);

        if (!profileRes.ok) {
          throw new Error(
            profileRes.status === 401 || profileRes.status === 403
              ? "Please log in as crew to view this page."
              : `Failed to load profile (${profileRes.status})`
          );
        }

        if (!dashboardRes.ok) {
          throw new Error(
            dashboardRes.status === 401 || dashboardRes.status === 403
              ? "Please log in as crew to view this page."
              : `Failed to load dashboard (${dashboardRes.status})`
          );
        }

        const profileData: CrewProfile = await profileRes.json();
        const dashboardData: CrewDashboardResponse = await dashboardRes.json();

        setProfile(profileData);
        setDashboard(dashboardData);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load crew home page.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const upcomingFlights = dashboard?.upcoming_flights ?? [];
  const nextFlight = dashboard?.stats?.next_flight ?? null;
  const totalHours = dashboard?.stats?.total_hours_completed ?? 0;

  const displayEmail =
    profile?.email || profile?.email_id || "email not available";
  const role = profile?.is_pilot ? "Pilot" : "Crew";

  return (
    <div className="flex min-h-screen">
      <CrewSidebar />

      <div className="flex-1 bg-gray-100 p-10">
        <h1 className="text-3xl font-semibold text-black mb-2">
          Crew Dashboard
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Welcome to your crew portal. View your profile, upcoming flights and key
          stats at a glance.
        </p>

        {loading && (
          <p className="text-gray-600 text-sm mb-4">Loading your data…</p>
        )}

        {error && !loading && (
          <div className="mb-4 rounded-md bg-red-100 px-4 py-2 text-sm text-red-800">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* TOP: Profile + stats */}
            <div className="grid gap-6 md:grid-cols-[1.6fr,1.4fr] mb-8">
              {/* Profile card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h2 className="text-lg font-semibold text-black mb-3">
                  My Profile
                </h2>
                {profile ? (
                  <div className="space-y-2 text-sm text-gray-800">
                    <div>
                      <div className="text-xs text-gray-500">Name</div>
                      <div className="font-medium text-black">
                        {profile.name}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="font-medium text-black">
                        {displayEmail}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Role</div>
                      <div className="font-medium text-black">{role}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Phone</div>
                      <div className="font-medium text-black">
                        {profile.phone || "—"}
                      </div>
                    </div>
                    <div className="pt-3">
                      <Link
                        href="/crew/profile"
                        className="inline-flex items-center px-4 py-2 rounded-full border border-black text-xs font-medium text-black hover:bg-black hover:text-white transition"
                      >
                        View full profile
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    Could not load profile.
                  </p>
                )}
              </div>

              {/* Stats card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h2 className="text-lg font-semibold text-black mb-3">
                  Flight Summary
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="text-xs text-gray-500">Total Hours</div>
                    <div className="mt-1 text-2xl font-bold text-black">
                      {totalHours.toFixed(1)}
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="text-xs text-gray-500">
                      Upcoming Flights
                    </div>
                    <div className="mt-1 text-2xl font-bold text-black">
                      {upcomingFlights.length}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-xs text-gray-500 mb-1">Next Flight</div>
                  {nextFlight ? (
                    <div className="text-sm text-gray-800">
                      <div className="font-semibold text-black">
                        {nextFlight.flight_number} ·{" "}
                        {nextFlight.source_airport_code} →{" "}
                        {nextFlight.destination_airport_code}
                      </div>
                      <div className="text-gray-600">
                        {new Date(nextFlight.date).toLocaleDateString()} at{" "}
                        {nextFlight.scheduled_departure_time.slice(0, 5)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Departs in{" "}
                        {formatDuration(
                          nextFlight.time_until_departure_minutes
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      No upcoming flights.
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <Link
                    href="/crew/flights"
                    className="inline-flex items-center px-4 py-2 rounded-full border border-black text-xs font-medium text-black hover:bg-black hover:text-white transition"
                  >
                    View all flights
                  </Link>
                </div>
              </div>
            </div>

            {/* BOTTOM: upcoming flights preview */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-black">
                  Upcoming Flights (Next 3)
                </h2>
                <Link
                  href="/crew/flights"
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  See full list
                </Link>
              </div>

              {upcomingFlights.length === 0 ? (
                <p className="text-sm text-gray-600">
                  You have no upcoming flights.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm text-gray-800">
                    <thead>
                      <tr className="border-b text-xs uppercase text-gray-500">
                        <th className="py-2 pr-4">Flight</th>
                        <th className="py-2 pr-4">Date</th>
                        <th className="py-2 pr-4">Route</th>
                        <th className="py-2 pr-4">Departure</th>
                        <th className="py-2 pr-4">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingFlights.slice(0, 3).map((f) => (
                        <tr
                          key={`${f.flight_number}-${f.date}-${f.scheduled_departure_time}`}
                          className="border-b last:border-none"
                        >
                          <td className="py-2 pr-4 text-black">
                            {f.flight_number}
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}