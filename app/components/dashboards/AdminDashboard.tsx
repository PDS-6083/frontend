"use client";

import AdminSidebar from "@/app/components/sidebars/AdminSidebar";
import PopularRoutesCard from "@/app/admin/components/PopularRoutesCard";
import FlightsStatCard from "@/app/admin/components/FlightsStatCard";
import OldAircraftsCard from "@/app/admin/components/OldAircraftsCard";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 bg-gray-100 p-10">

        <h1 className="text-3xl font-bold text-black mb-10">Dashboard</h1>

        {/* MAIN WRAPPER */}
        <div className="flex space-x-10">

          {/* POPULAR ROUTES */}
          <PopularRoutesCard />

          {/* STATS + OLDEST AIRCRAFTS */}
          <div className="flex flex-col space-y-10">

            {/* STATS SECTION */}
            <div className="flex flex-col space-y-8">

              {/* Row 1 */}
              <div className="flex gap-6">
                <FlightsStatCard count={23} label="Flights in Air" />
                <FlightsStatCard count={100} label="Weekly Flts" />
                <FlightsStatCard count={"61%"} label="Util. Rate" />
              </div>

              {/* Row 2 */}
              <div className="flex gap-6">
                <FlightsStatCard count={3} label="Aircrafts On-ground" />
                <FlightsStatCard count={1} label="Maint Crafts" />
              </div>

            </div>

            {/* OLDEST AIRCRAFTS */}
            <OldAircraftsCard />

          </div>

        </div>
      </div>
    </div>
  );
}
