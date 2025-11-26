"use client";

import Sidebar from "./components/sidebar";
import PopularRoutesCard from "./components/PopularRoutesCard";
import FlightsStatCard from "./components/FlightsStatCard";
import OldAircraftsCard from "./components/OldAircraftsCard";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen">
      
      {/* Sidebar */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 bg-gray-100 p-10">

        <h1 className="text-4xl font-bold mb-10 text-black">Dashboard</h1>

        {/* Layout container */}
        <div className="flex space-x-10">

          {/* Popular Routes */}
          <PopularRoutesCard />

          {/* Stats */}
          <div className="flex flex-col space-y-6">
            <FlightsStatCard count={23} label="Flights in Air" />
            <FlightsStatCard count={3} label="Flights in Maint." />
          </div>

          {/* Old Aircrafts */}
          <OldAircraftsCard />

        </div>
      </div>
    </div>
  );
}
