"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/app/components/sidebars/AdminSidebar";
import PopularRoutesCard from "@/app/admin/components/PopularRoutesCard";
import FlightsStatCard from "@/app/admin/components/FlightsStatCard";
import OldAircraftsCard from "@/app/admin/components/OldAircraftsCard";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState<{
    most_popular_routes: any[];
    flights_in_air: number;
    aircraft_in_maintenance: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard`,
          { credentials: "include" }
        );

        if (res.ok) {
          const data = await res.json();
          setDashboard(data);
        }
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center text-black">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 bg-gray-100 p-10">

        <h1 className="text-3xl font-bold text-black mb-10">Dashboard</h1>

        <div className="flex space-x-10">

          {/* POPULAR ROUTES CARD */}
          <PopularRoutesCard routes={dashboard?.most_popular_routes ?? []} />

          {/* STATS + OLDEST AIRCRAFTS */}
          <div className="flex flex-col space-y-10">

            {/* STATS */}
            <div className="flex flex-col space-y-8">

              <div className="flex gap-6">
                <FlightsStatCard
                  count={dashboard?.flights_in_air ?? 0}
                  label="Flights in Air"
                />
                {/* Weekly flights: backend does not provide → fallback */}
                <FlightsStatCard count={100} label="Weekly Flights" />

                {/* Utilization rate: backend does not provide → fallback */}
                <FlightsStatCard count={"61%"} label="Util. Rate" />
              </div>

              <div className="flex gap-6">
                <FlightsStatCard
                  count={dashboard?.aircraft_in_maintenance ?? 0}
                  label="Maint Crafts"
                />
                {/* On-ground crafts = Unknown backend → fallback */}
                <FlightsStatCard count={3} label="Aircrafts On-ground" />
              </div>
            </div>

            {/* OLDEST AIRCRAFTS (Static for now until backend provides years) */}
            <OldAircraftsCard />

          </div>
        </div>
      </div>
    </div>
  );
}
