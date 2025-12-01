"use client";

import { useEffect, useState } from "react";
import { getEngineerJobs } from "@/lib/api";
import EngineerSidebar from "@/app/components/sidebars/EngineerSidebar";

type AircraftRow = {
  reg: string;
  status: "Pending" | "Under Repair" | "Available" | "On Flight";
};

type MaintenanceRow = {
  reg: string;
  status: "Pending" | "In Progress" | "Done";
  role: string;
  startDate: string;
};

const AIRCRAFTS: AircraftRow[] = [
  { reg: "N482KM", status: "Pending" },
  { reg: "G-TJXA", status: "Under Repair" },
  { reg: "VH-ZPQ", status: "Available" },
  { reg: "C-FLOR", status: "Available" },
  { reg: "D-ABRT", status: "On Flight" },
  { reg: "JA823H", status: "On Flight" },
  { reg: "F-HLBN", status: "Available" },
];

const JOBS: MaintenanceRow[] = [
  {
    reg: "G-TJXA",
    status: "Pending",
    role: "Technician",
    startDate: "10/04/25",
  },
  {
    reg: "N482KM",
    status: "In Progress",
    role: "Chief Engineer",
    startDate: "11/05/25",
  },
  {
    reg: "D-ABRT",
    status: "Done",
    role: "Technician",
    startDate: "09/28/25",
  },
];

function aircraftStatusClass(status: AircraftRow["status"]) {
  const base =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold";
  switch (status) {
    case "Pending":
      return base + " bg-red-100 text-red-700";
    case "Under Repair":
      return base + " bg-yellow-100 text-yellow-700";
    case "On Flight":
      return base + " bg-blue-100 text-blue-700";
    default:
      return base + " bg-green-100 text-green-700";
  }
}

function jobStatusClass(status: MaintenanceRow["status"]) {
  const base =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold";
  switch (status) {
    case "Pending":
      return base + " bg-red-100 text-red-700";
    case "In Progress":
      return base + " bg-yellow-100 text-yellow-700";
    default:
      return base + " bg-green-100 text-green-700";
  }
}

type EngineerJob = {
  job_id: number;
  registration_number: string;
  checkin_date: string;
  status: string;
  type: string;
};

export default function EngineerMaintenancePage() {
  const [jobs, setJobs] = useState<EngineerJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getEngineerJobs();
        setJobs(data.items || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load maintenance jobs");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">My Maintenance Jobs</h1>

      {loading && <p>Loading jobs...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && jobs.length === 0 && (
        <p>You have no jobs assigned.</p>
      )}

      {/* 🔹 Simple table; you can replace or style it like your original */}
      {jobs.length > 0 && (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Job ID</th>
              <th className="text-left py-2">Aircraft</th>
              <th className="text-left py-2">Type</th>
              <th className="text-left py-2">Check-in</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.job_id} className="border-b">
                <td className="py-2">{job.job_id}</td>
                <td className="py-2">{job.registration_number}</td>
                <td className="py-2">{job.type}</td>
                <td className="py-2">{job.checkin_date}</td>
                <td className="py-2">{job.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}