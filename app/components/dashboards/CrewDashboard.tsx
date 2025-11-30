"use client";

import Link from "next/link";
import CrewSidebar from "../../components/sidebars/CrewSidebar";

type Flight = {
  id: string;
  reg: string;
  date: string;
  route: string;
  departure: string;
  hours: string;
};

const FLIGHTS: Flight[] = [
  { id: "FLT-001", reg: "G-TJXA", date: "12-10-25", route: "JFK → IAD", departure: "06:00 pm", hours: "1h 10m" },
  { id: "FLT-002", reg: "N482KM", date: "12-11-25", route: "JFK → LAX", departure: "01:30 pm", hours: "6h 15m" },
  { id: "FLT-003", reg: "D-ABRT", date: "12-12-25", route: "DBX → IAD", departure: "10:00 am", hours: "4h 05m" },
];

export default function CrewFlightsPage() {
  return (
    <div className="flex min-h-screen">
      <CrewSidebar />

      <div className="flex-1 bg-gray-100 p-10">
        <h1 className="text-3xl font-semibold mb-4 text-black">My Flights</h1>
        <p className="text-sm text-gray-600 mb-6">Upcoming flights assigned to you.</p>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 text-xs uppercase text-gray-500">
                <tr>
                  <th className="py-3">Aircraft Reg.</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Route</th>
                  <th className="py-3">Departure</th>
                  <th className="py-3">Hours</th>
                  <th className="py-3 text-right">Details</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-gray-700">
                {FLIGHTS.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50">
                    <td className="py-3 pr-4 text-black">{f.reg}</td>
                    <td className="py-3 pr-4">{f.date}</td>
                    <td className="py-3 pr-4">{f.route}</td>
                    <td className="py-3 pr-4">{f.departure}</td>
                    <td className="py-3 pr-4">{f.hours}</td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/crew/flights/${f.id}`}
                        className="rounded-full border border-black px-4 py-1 text-xs font-semibold text-black hover:bg-black hover:text-white transition"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
                {FLIGHTS.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-xs text-gray-500">
                      No flights scheduled.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* static pagination / footer */}
          <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
            <div>Showing {FLIGHTS.length} flights</div>
            <div className="space-x-2">
              <button className="rounded-md border border-gray-300 px-2 py-1">1</button>
              <button className="rounded-md border border-gray-300 px-2 py-1">2</button>
              <button className="rounded-md border border-gray-300 px-2 py-1">3</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}