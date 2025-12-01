"use client";

import AdminSidebar from "@/app/components/sidebars/EngineerSidebar";
import ProfileCard from "@/app/components/ProfileCard";
import { FaUserCircle } from "react-icons/fa";


import { useEffect, useState } from "react";
import { getEngineerJobs } from "@/lib/api";

type EngineerJob = {
  job_id: number;
  registration_number: string;
  checkin_date: string;
  status: string;
  type: string;
};

export default function EngineerHomePage() {
  const [jobs, setJobs] = useState<EngineerJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getEngineerJobs(); // /api/engineer/my-jobs
        setJobs(data.items || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const activeJobs = jobs.filter(
    (j) => j.status === "PENDING" || j.status === "IN_PROGRESS"
  );

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-lg border p-4">
        <h1 className="text-xl font-semibold mb-2">Engineer Dashboard</h1>

        {loading && <p>Loading your jobs...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && jobs.length === 0 && (
          <p>No jobs assigned yet.</p>
        )}

        {jobs.length > 0 && (
          <div className="text-sm space-y-1">
            <p>
              <span className="font-medium">Total jobs:</span> {jobs.length}
            </p>
            <p>
              <span className="font-medium">Active:</span> {activeJobs.length}
            </p>
            <p>
              <span className="font-medium">Completed:</span>{" "}
              {jobs.length - activeJobs.length}
            </p>
          </div>
        )}
      </section>

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
            role="Engineer"
            email="admin@aero.com"
            employeeId="ADM-2025-001"
          />

        </div>
      </div>
    </div>
    </div>
  );
}