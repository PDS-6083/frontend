"use client";

import AdminSidebar from "@/app/components/sidebars/CrewSidebar";
import ProfileCard from "@/app/components/ProfileCard";
import { FaUserCircle } from "react-icons/fa";

export default function AdminProfilePage() {
  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-10">
        
        <h1 className="text-3xl font-bold text-black mb-10">My Profile</h1>

        <div className="flex space-x-10">
          
          {/* Large User Icon */}
          <FaUserCircle className="text-purple-600" size={120} />

          {/* Shared Profile Card */}
          <ProfileCard
            name="John Doe"
            phone="+1 324 234-3456"
            role="Pilot"
            email="admin@aero.com"
            employeeId="ADM-2025-001"
          />

        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { getCrewSchedule } from "@/lib/api";

type CrewScheduleItem = {
  flight_number: string;
  date: string;
  departure_time: string;
  route_id?: number;
};

export default function CrewHomePage() {
  const [schedule, setSchedule] = useState<CrewScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getCrewSchedule(); // calls /api/crew/my-schedule
        setSchedule(data.items || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load crew schedule");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const nextFlight = schedule[0];

  return (
    <div className="flex flex-col gap-6">
      {/* 🔹 New: backend-driven “Next flight” summary */}
      <section className="rounded-lg border p-4">
        <h1 className="text-xl font-semibold mb-2">Crew Portal</h1>

        {loading && <p>Loading your schedule...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && !nextFlight && (
          <p>You have no assigned flights yet.</p>
        )}

        {nextFlight && (
          <div className="text-sm">
            <p>
              <span className="font-medium">Next Flight:</span>{" "}
              {nextFlight.flight_number}
            </p>
            <p>
              <span className="font-medium">Date:</span> {nextFlight.date}
            </p>
            <p>
              <span className="font-medium">Departure:</span>{" "}
              {nextFlight.departure_time}
            </p>
          </div>
        )}
      </section>

      <div className="flex-1 bg-gray-100 p-10">
        
        <h1 className="text-3xl font-bold text-black mb-10">My Profile</h1>

        <div className="flex space-x-10">
          
          {/* Large User Icon */}
          <FaUserCircle className="text-purple-600" size={120} />

          {/* Shared Profile Card */}
          <ProfileCard
            name="John Doe"
            phone="+1 324 234-3456"
            role="Pilot"
            email="admin@aero.com"
            employeeId="ADM-2025-001"
          />

        </div>
      </div>
    </div>
  );
}