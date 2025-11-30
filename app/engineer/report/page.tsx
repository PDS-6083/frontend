"use client";

import { useState } from "react";
import EngineerSidebar from "@/app/components/sidebars/EngineerSidebar";

type Report = {
  id: number;
  aircraftReg: string;
  type: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  createdAt: string;
  status: "Open" | "In Review" | "Closed";
};

export default function EngineerMaintenanceReportPage() {
  const [aircraftReg, setAircraftReg] = useState("");
  const [type, setType] = useState("Routine");
  const [severity, setSeverity] = useState<Report["severity"]>("Medium");
  const [description, setDescription] = useState("");
  const [reports, setReports] = useState<Report[]>([
    {
      id: 1,
      aircraftReg: "G-TJXA",
      type: "Hydraulic leak inspection",
      severity: "High",
      createdAt: "10/04/25 09:32",
      status: "In Review",
    },
    {
      id: 2,
      aircraftReg: "N482KM",
      type: "Cabin pressure anomaly",
      severity: "Critical",
      createdAt: "10/01/25 21:10",
      status: "Open",
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aircraftReg || !description.trim()) return;

    const newReport: Report = {
      id: reports.length + 1,
      aircraftReg,
      type: description.split("\n")[0].slice(0, 60) || type,
      severity,
      createdAt: new Date().toLocaleString(),
      status: "Open",
    };

    setReports([newReport, ...reports]);
    setAircraftReg("");
    setDescription("");
    setSeverity("Medium");
    setType("Routine");
  };

  const severityClass = (sev: Report["severity"]) => {
    const base =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold";
    if (sev === "Low") return base + " bg-gray-100 text-gray-700";
    if (sev === "Medium") return base + " bg-yellow-100 text-yellow-700";
    if (sev === "High") return base + " bg-orange-100 text-orange-700";
    return base + " bg-red-100 text-red-700";
  };

  const statusClass = (status: Report["status"]) => {
    const base =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold";
    if (status === "Open") return base + " bg-red-100 text-red-700";
    if (status === "In Review")
      return base + " bg-blue-100 text-blue-700";
    return base + " bg-green-100 text-green-700";
  };

  return (
    <div className="flex min-h-screen">
      <EngineerSidebar />

      <div className="flex-1 bg-gray-100 p-10">
        <h1 className="text-3xl font-semibold mb-2 text-black">
          Maintenance Report
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Log new maintanence findings and track previously submitted reports.
        </p>

        <div className="grid gap-6 lg:grid-cols-[1.4fr,1.6fr]">
          {/* LEFT: FORM */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-base font-semibold text-black mb-4">
              New Maintenance Report
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label className="block mb-1 font-medium text-gray-800">
                  Aircraft Registration
                </label>
                <input
                  type="text"
                  value={aircraftReg}
                  onChange={(e) => setAircraftReg(e.target.value.toUpperCase())}
                  placeholder="e.g. G-TJXA"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 font-medium text-gray-800">
                    Report Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-black bg-white"
                  >
                    <option>Routine</option>
                    <option>Unscheduled</option>
                    <option>Defect</option>
                    <option>Inspection</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-medium text-gray-800">
                    Severity
                  </label>
                  <select
                    value={severity}
                    onChange={(e) =>
                      setSeverity(e.target.value as Report["severity"])
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-black bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-800">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Describe the issue, location, conditions, and any temporary actions taken..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>

              <button
                type="submit"
                className="mt-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Submit Report
              </button>
            </form>
          </div>

          {/* RIGHT: RECENT REPORTS TABLE */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-black">
                Recent Reports
              </h2>
              <span className="text-xs text-gray-500">
                Showing {reports.length} reports
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="py-2">Aircraft</th>
                    <th className="py-2">Summary</th>
                    <th className="py-2">Severity</th>
                    <th className="py-2">Created</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {reports.map((r) => (
                    <tr key={r.id}>
                      <td className="py-2 pr-3">{r.aircraftReg}</td>
                      <td className="py-2 pr-3 text-xs">
                        {r.type.length > 60
                          ? r.type.slice(0, 57) + "..."
                          : r.type}
                      </td>
                      <td className="py-2 pr-3">
                        <span className={severityClass(r.severity)}>
                          {r.severity}
                        </span>
                      </td>
                      <td className="py-2 pr-3 text-xs">{r.createdAt}</td>
                      <td className="py-2 pr-3">
                        <span className={statusClass(r.status)}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {reports.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-6 text-center text-xs text-gray-500"
                      >
                        No reports yet. Use the form on the left to submit one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Note: this is manual example we have to replace this with api
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}