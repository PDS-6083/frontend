"use client";

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

export default function EngineerDashboard() {
  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <EngineerSidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 bg-gray-100 p-10">
        <h1 className="text-3xl font-semibold mb-6 text-black">Dashboard</h1>

        <div className="grid gap-8 lg:grid-cols-[1.7fr,1fr]">
          {/* Aircrafts + status table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-black">Aircrafts</h2>
              <span className="text-xs text-gray-500">
                Engineer view • fleet status
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="py-2">Reg. num</th>
                    <th className="py-2">Status</th>
                    <th className="py-2 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {AIRCRAFTS.map((ac) => (
                    <tr key={ac.reg} className="hover:bg-gray-50">
                      <td className="py-2 pr-4 text-black">{ac.reg}</td>
                      <td className="py-2 pr-4">
                        <span className={aircraftStatusClass(ac.status)}>
                          {ac.status}
                        </span>
                      </td>
                      <td className="py-2 text-right">
                        <button className="border border-black text-xs font-semibold px-4 py-1 rounded-full hover:bg-black hover:text-white transition">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right column: jobs + monthly complete */}
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-base font-semibold text-black mb-4">
                Assigned Maintenance Jobs
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
                    <tr>
                      <th className="py-2">Reg. num</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Role</th>
                      <th className="py-2">Start Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {JOBS.map((job) => (
                      <tr key={job.reg} className="hover:bg-gray-50">
                        <td className="py-2 pr-4 text-black">{job.reg}</td>
                        <td className="py-2 pr-4">
                          <span className={jobStatusClass(job.status)}>
                            {job.status}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-gray-700">
                          {job.role}
                        </td>
                        <td className="py-2 pr-4 text-gray-700">
                          {job.startDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Monthly Complete Jobs
                </p>
                <p className="mt-2 text-gray-600 text-sm">
                  Number of maintenance tasks successfully closed this month.
                </p>
              </div>
              <div className="w-20 h-20 rounded-xl border border-gray-300 flex items-center justify-center">
                <span className="text-3xl font-bold text-black">5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
