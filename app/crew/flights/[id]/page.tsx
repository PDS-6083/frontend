"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import CrewSidebar from "../../../components/sidebars/CrewSidebar";

export default function FlightDetailsPage() {
  // useParams in App Router client components is available via next/navigation
  // but it returns an empty object in some setups; for a safe demo we get id from the URL manually:
  const search = typeof window !== "undefined" ? window.location.pathname : "";
  const id = search.split("/").pop() || "unknown-id";

  // Here we have to replace this with api 
  const flight = {
    id,
    reg: "G-TJXA",
    date: "12-10-25",
    route: "JFK → IAD",
    departure: "06:00 pm",
    hours: "1h 10m",
    checkin: "10/04/25",
    crew: [
      { name: "Alyssa", role: "Captain" },
      { name: "John Doe", role: "First Officer" },
    ],
  };

  return (
    <div className="flex min-h-screen">
      <CrewSidebar />

      <div className="flex-1 bg-gray-100 p-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-black">Flight Details</h1>
          <Link
            href="/crew/flights"
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
          >
            Back to flights
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Flight {flight.id}</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Aircraft Registration number:</strong> {flight.reg}</p>
              <p><strong>Date:</strong> {flight.date}</p>
              <p><strong>Route:</strong> {flight.route}</p>
              <p><strong>Departure:</strong> {flight.departure}</p>
              <p><strong>Hours:</strong> {flight.hours}</p>
              <p><strong>Checkin Date:</strong> {flight.checkin}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-base font-semibold mb-3">Crew</h3>
            <div className="space-y-2 text-sm text-gray-700">
              {flight.crew.map((c) => (
                <div key={c.name} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-black">{c.name}</p>
                    <p className="text-xs text-gray-600">{c.role}</p>
                  </div>
                  <div>
                    <button className="rounded-full border border-black px-3 py-1 text-xs text-black hover:bg-black hover:text-white transition">
                      Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}