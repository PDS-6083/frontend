"use client";

import { useEffect, useState } from "react";
import EngineerSidebar from "@/app/components/sidebars/EngineerSidebar";

// Backend types
type DashboardAircraftItem = {
  registration_number: string;
  status: string; 
};

type DashboardAssignedJobItem = {
  job_id: number;
  aircraft_registration: string;
  role: string;
  checkin_date: string; // ISO datetime
};

type EngineerDashboardStats = {
  monthly_completed_jobs: number;
};

type EngineerDashboardResponse = {
  aircrafts: DashboardAircraftItem[];
  assigned_jobs: DashboardAssignedJobItem[];
  stats: EngineerDashboardStats;
};

type AircraftRow = {
  reg: string;
  status: string;
};

type MaintenanceRow = {
  jobId: number;
  reg: string;
  status: string;  
  role: string;
  startDate: string;
};

function aircraftStatusClass(status: string): string {
  const lower = status.toLowerCase();
  if (lower.includes("maintenance") || lower.includes("repair")) {
    return "px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800";
  }
  if (lower.includes("retired")) {
    return "px-3 py-1 rounded-full text-xs bg-gray-200 text-gray-700";
  }
  return "px-3 py-1 rounded-full text-xs bg-green-100 text-green-800";
}

export default function EngineerDashboard() {
  const [aircrafts, setAircrafts] = useState<AircraftRow[]>([]);
  const [jobs, setJobs] = useState<MaintenanceRow[]>([]);
  const [stats, setStats] = useState<EngineerDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch("http://localhost:8000/api/engineer/dashboard", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            setError("You must be logged in as engineer to view this page.");
          } else {
            setError(`Failed to load engineer dashboard (${res.status})`);
          }
          return;
        }

        const data: EngineerDashboardResponse = await res.json();

        // Map aircrafts
        const mappedAircrafts: AircraftRow[] = (data.aircrafts || []).map(
          (a) => ({
            reg: a.registration_number,
            status: a.status || "Unknown",
          })
        );

        const mappedJobs: MaintenanceRow[] = (data.assigned_jobs || []).map(
          (j) => ({
            jobId: j.job_id,
            reg: j.aircraft_registration,
            status: "In Progress", 
            role: j.role,
            startDate: new Date(j.checkin_date).toLocaleDateString(),
          })
        );

        setAircrafts(mappedAircrafts);
        setJobs(mappedJobs);
        setStats(data.stats);
      } catch (e) {
        console.error(e);
        setError("Something went wrong while loading engineer dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const totalAircrafts = aircrafts.length;
  const activeJobs = jobs.length;
  const monthlyCompleted = stats?.monthly_completed_jobs ?? 0;

  return (
    <div className="flex min-h-screen">
      <EngineerSidebar />

      <div className="flex-1 bg-gray-100 p-10">
        <h1 className="text-3xl font-semibold mb-4 text-black">
          Engineer Dashboard
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Overview of aircraft status and your assigned maintenance jobs.
        </p>

        {loading && <p className="text-gray-600 text-sm">Loading dashboard...</p>}

        {error && !loading && (
          <div className="mb-4 rounded-md bg-red-100 px-4 py-2 text-sm text-red-800">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
            {/* LEFT – tables */}
            <div className="space-y-6">
              {/* Aircraft status table */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h2 className="text-lg font-semibold mb-3 text-black">
                  Aircraft Status
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm text-gray-800">
                    <thead>
                      <tr className="border-b text-xs uppercase text-gray-500">
                        <th className="py-2 pr-4">Aircraft Reg.</th>
                        <th className="py-2 pr-4">Status</th>
                        <th className="py-2 pr-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aircrafts.map((ac) => (
                        <tr key={ac.reg} className="hover:bg-gray-50">
                          <td className="py-2 pr-4 text-black">{ac.reg}</td>
                          <td className="py-2 pr-4">
                            <span className={aircraftStatusClass(ac.status)}>
                              {ac.status}
                            </span>
                          </td>
                          <td className="py-2 text-right">
                            <button className="border border-black px-3 py-1 rounded-full text-xs text-black hover:bg-black hover:text-white transition">
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                      {aircrafts.length === 0 && (
                        <tr>
                          <td
                            colSpan={3}
                            className="py-3 text-center text-gray-600 text-sm"
                          >
                            No aircraft records available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Jobs / maintenance table */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h2 className="text-lg font-semibold mb-3 text-black">
                  Assigned Maintenance Jobs
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm text-gray-800">
                    <thead>
                      <tr className="border-b text-xs uppercase text-gray-500">
                        <th className="py-2 pr-4">Aircraft Reg.</th>
                        <th className="py-2 pr-4">Status</th>
                        <th className="py-2 pr-4">Role</th>
                        <th className="py-2 pr-4">Start Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job) => (
                        <tr key={job.jobId} className="hover:bg-gray-50">
                          <td className="py-2 pr-4 text-black">{job.reg}</td>
                          <td className="py-2 pr-4 text-black">{job.status}</td>
                          <td className="py-2 pr-4 text-black">{job.role}</td>
                          <td className="py-2 pr-4 text-black">
                            {job.startDate}
                          </td>
                        </tr>
                      ))}
                      {jobs.length === 0 && (
                        <tr>
                          <td
                            colSpan={4}
                            className="py-3 text-center text-gray-600 text-sm"
                          >
                            No jobs assigned.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* RIGHT – summary stats (all dynamic now) */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Total Aircraft
                </h3>
                <p className="text-3xl font-bold text-black">{totalAircrafts}</p>
                <p className="mt-2 text-gray-600 text-sm">
                  Total number of aircraft registered in the system.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Active Jobs
                </h3>
                <p className="text-3xl font-bold text-black">{activeJobs}</p>
                <p className="mt-2 text-gray-600 text-sm">
                  Maintenance tasks currently assigned to you.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Jobs Completed This Month
                </h3>
                <p className="text-3xl font-bold text-black">
                  {monthlyCompleted}
                </p>
                <p className="mt-2 text-gray-600 text-sm">
                  Number of maintenance tasks successfully closed this month.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}