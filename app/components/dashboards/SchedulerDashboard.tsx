"use client";

import { useEffect, useState } from "react";
import SchedulerSidebar from "@/app/components/sidebars/SchedulerSidebar";

interface DashboardFlightSummary {
  flight_number: string;
  route_id: number;
  source_airport_code: string;
  destination_airport_code: string;
  approved_capacity: number;
  date: string;
  scheduled_departure_time: string;
  scheduled_arrival_time: string;
  aircraft_registration: string;
}

interface DashboardStats {
  flights_in_air: number;
  weekly_flights: number;
  utilization_rate: number;
  aircrafts_on_ground: number;
  maintenance_aircrafts: number;
}

interface DashboardResponse {
  recent_flights: DashboardFlightSummary[];
  stats: DashboardStats;
}

export default function SchedulerDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/scheduler/dashboard`,
          { credentials: "include" }
        );

        if (!res.ok) {
          console.error("Error loading dashboard:", await res.text());
          return;
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Network error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <SchedulerSidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 bg-gray-100 p-10">

        <h1 className="text-3xl font-bold text-black mb-10">Dashboard</h1>

        {/* Loading State */}
        {loading && (
          <p className="text-gray-600">Loading dashboard...</p>
        )}

        {/* DATA RENDER */}
        {data && (
          <div className="flex space-x-10">

            {/* RECENTLY SCHEDULED FLIGHTS */}
            <div className="bg-white border border-gray-300 shadow-sm rounded-md p-5 w-80">
              <ul className="space-y-3 text-black">

                {data.recent_flights.length === 0 && (
                  <li className="text-gray-500 text-sm">
                    No flights scheduled yet.
                  </li>
                )}

                {data.recent_flights.map((f, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>
                      {f.source_airport_code} → {f.destination_airport_code}
                    </span>
                    <span className="text-gray-500">
                      capacity {f.approved_capacity}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="text-center text-gray-500 text-sm mt-3">
                Recently Scheduled Flights
              </p>
            </div>

            {/* STATS */}
            <div className="flex flex-col space-y-8">

              {/* TOP ROW */}
              <div className="flex gap-6">
                <div className="bg-white border-2 border-black shadow-sm rounded-md p-6 text-center w-40">
                  <p className="text-3xl font-bold text-black">
                    {data.stats.flights_in_air}
                  </p>
                  <p className="text-gray-600 text-sm">Flights in Air</p>
                </div>

                <div className="bg-white border-2 border-black shadow-sm rounded-md p-6 text-center w-40">
                  <p className="text-3xl font-bold text-black">
                    {data.stats.weekly_flights}
                  </p>
                  <p className="text-gray-600 text-sm">Weekly Flts</p>
                </div>

                <div className="bg-white border-2 border-black shadow-sm rounded-md p-6 text-center w-40">
                  <p className="text-3xl font-bold text-black">
                    {Math.round(data.stats.utilization_rate * 100)}%
                  </p>
                  <p className="text-gray-600 text-sm">Util. Rate</p>
                </div>
              </div>

              {/* BOTTOM ROW */}
              <div className="flex gap-6">
                <div className="bg-white border-2 border-black shadow-sm rounded-md p-6 text-center w-40">
                  <p className="text-3xl font-bold text-black">
                    {data.stats.aircrafts_on_ground}
                  </p>
                  <p className="text-gray-600 text-sm">Aircrafts On-ground</p>
                </div>

                <div className="bg-white border-2 border-black shadow-sm rounded-md p-6 text-center w-40">
                  <p className="text-3xl font-bold text-black">
                    {data.stats.maintenance_aircrafts}
                  </p>
                  <p className="text-gray-600 text-sm">Maint Crafts</p>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
