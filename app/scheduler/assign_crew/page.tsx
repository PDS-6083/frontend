"use client";

import { useEffect, useState } from "react";
import SchedulerSidebar from "@/app/components/sidebars/SchedulerSidebar";
import useRoleGuard from "@/app/hooks/useRoleGuard";

interface CrewMember {
  email_id: string;
  name: string;
  phone?: string;
  is_pilot: boolean;
}

interface Flight {
  flight_number: string;
}

export default function AssignCrewPage() {
  useRoleGuard(["scheduler"]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);

  const [selectedFlight, setSelectedFlight] = useState("");
  const [pilot, setPilot] = useState("");
  const [coPilot, setCoPilot] = useState("");
  const [cabinCrew, setCabinCrew] = useState<string[]>([]);
  const [remarks, setRemarks] = useState("");

  // ---------------------------------------------------------------------------
  // Load flights + crew list
  // ---------------------------------------------------------------------------

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch flights
        const flightsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/scheduler/flights`,
          { credentials: "include" }
        );
        const flightsJson = await flightsRes.json();
        setFlights(flightsJson);

        // Fetch all crew members
        const crewRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/scheduler/crew`,
          { credentials: "include" }
        );
        const crewJson = await crewRes.json();
        setCrew(crewJson);

      } catch (err) {
        console.error("Failed to load scheduler data:", err);
      }
    }

    loadData();
  }, []);

  // ---------------------------------------------------------------------------
  // Handle SAVE → Call backend assign crew
  // ---------------------------------------------------------------------------

  const handleSave = async () => {
    if (!selectedFlight) {
      alert("Please select a flight.");
      return;
    }
    if (!pilot || !coPilot || cabinCrew.length === 0) {
      alert("Please select pilot, co-pilot, and cabin crew.");
      return;
    }

    const crewEmails = [
      pilot,
      coPilot,
      ...cabinCrew
    ];

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/scheduler/flights/${selectedFlight}/assign-crew`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ crew_emails: crewEmails }),
        }
      );

      if (!res.ok) {
        const error = await res.json();
        alert(error.detail || "Crew assignment failed");
        return;
      }

      alert("Crew assigned successfully!");

    } catch (err) {
      console.error("Assign crew error:", err);
      alert("Network error");
    }
  };

  return (
    <div className="flex min-h-screen">
      <SchedulerSidebar />

      <div className="flex-1 bg-gray-100 p-10">
        <h1 className="text-3xl font-bold text-black">Assign Crew</h1>
        <p className="text-gray-600 mb-10">
          Assign pilots and cabin crew to a flight.
        </p>

        <div className="grid grid-cols-2 gap-10 max-w-4xl">

          {/* FLIGHT */}
          <div>
            <label className="block text-sm font-semibold text-black">Flight</label>
            <select
              value={selectedFlight}
              onChange={(e) => setSelectedFlight(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            >
              <option value="">Select Flight</option>
              {flights.map((f) => (
                <option key={f.flight_number} value={f.flight_number}>
                  {f.flight_number}
                </option>
              ))}
            </select>
          </div>

          {/* PILOT */}
          <div>
            <label className="block text-sm font-semibold text-black">Pilot</label>
            <select
              value={pilot}
              onChange={(e) => setPilot(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            >
              <option value="">Select Pilot</option>
              {crew
                .filter((c) => c.is_pilot)
                .map((c) => (
                  <option key={c.email_id} value={c.email_id}>
                    {c.name} ({c.email_id})
                  </option>
                ))}
            </select>
          </div>

          {/* CO-PILOT */}
          <div>
            <label className="block text-sm font-semibold text-black">Co-Pilot</label>
            <select
              value={coPilot}
              onChange={(e) => setCoPilot(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            >
              <option value="">Select Co-Pilot</option>
              {crew
                .filter((c) => c.is_pilot)
                .map((c) => (
                  <option key={c.email_id} value={c.email_id}>
                    {c.name} ({c.email_id})
                  </option>
                ))}
            </select>
          </div>

          {/* CABIN CREW */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-black">Cabin Crew</label>

            <select
              multiple
              value={cabinCrew}
              onChange={(e) =>
                setCabinCrew(
                  Array.from(e.target.selectedOptions, (o) => o.value)
                )
              }
              className="w-full p-2 mt-2 border rounded-md bg-white text-black h-32"
            >
              {crew
                .filter((c) => !c.is_pilot)
                .map((c) => (
                  <option key={c.email_id} value={c.email_id}>
                    {c.name} ({c.email_id})
                  </option>
                ))}
            </select>

            <p className="text-xs text-gray-500 mt-1">
              Hold CTRL (Windows) or CMD (Mac) to select multiple cabin crew members.
            </p>
          </div>

          {/* REMARKS */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-black">Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full h-24 p-3 mt-2 border rounded-md bg-white text-black"
            />
          </div>

        </div>

        <div className="flex mt-10 space-x-5">
          <button
            onClick={handleSave}
            className="bg-red-500 text-white px-8 py-2 rounded-md hover:bg-red-600 transition"
          >
            Save
          </button>

          <button className="border border-gray-400 text-black px-8 py-2 rounded-md hover:bg-gray-300 transition">
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
