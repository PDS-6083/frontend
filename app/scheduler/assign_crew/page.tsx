"use client";

import { useState } from "react";
import SchedulerSidebar from "@/app/components/sidebars/SchedulerSidebar";

export default function AssignCrewPage() {
  const [flight, setFlight] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [sameDate, setSameDate] = useState(false);
  const [pilot, setPilot] = useState("");
  const [coPilot, setCoPilot] = useState("");
  const [additionalCrew, setAdditionalCrew] = useState("");
  const [cabinCrew, setCabinCrew] = useState("");
  const [dutyHours, setDutyHours] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleSameDateToggle = () => {
    setSameDate(!sameDate);
    if (!sameDate) {
      setArrivalDate(departureDate);
    }
  };

  const handleSave = () => {
    const crewAssignment = {
      flight,
      departureTime,
      departureDate,
      arrivalTime,
      arrivalDate,
      pilot,
      coPilot,
      additionalCrew,
      cabinCrew,
      dutyHours,
      remarks,
    };

    console.log("Crew Assignment Saved:", crewAssignment);
  };

  return (
    <div className="flex min-h-screen">
      <SchedulerSidebar />

      <div className="flex-1 bg-gray-100 p-10">
        <h1 className="text-3xl font-bold text-black">Assign Crew</h1>
        <p className="text-gray-600 mb-10">
          Please fill the following form to assign crew to a flight.
        </p>

        <div className="grid grid-cols-2 gap-10 max-w-4xl">

          <div>
            <label className="block text-sm font-semibold text-black">Flight</label>
            <input
              type="text"
              value={flight}
              onChange={(e) => setFlight(e.target.value)}
              placeholder="UA220"
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black">Departure Date</label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black">Departure Time</label>
            <input
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black">Arrival Date</label>
            <input
              type="date"
              value={arrivalDate}
              disabled={sameDate}
              onChange={(e) => setArrivalDate(e.target.value)}
              className={`w-full p-2 mt-2 border rounded-md bg-white text-black ${
                sameDate ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />

            <div className="flex items-center mt-2 space-x-2">
              <input
                type="checkbox"
                checked={sameDate}
                onChange={handleSameDateToggle}
                className="w-4 h-4"
              />
              <label className="text-sm text-gray-600">
                Arrival date same as departure date
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-black">Pilots</label>
            <input
              type="text"
              value={pilot}
              onChange={(e) => setPilot(e.target.value)}
              placeholder="Pilot Name"
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black">Co-Pilot</label>
            <input
              type="text"
              value={coPilot}
              onChange={(e) => setCoPilot(e.target.value)}
              placeholder="Co-Pilot Name"
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black">
              Additional Cockpit Crew
            </label>
            <input
              type="text"
              value={additionalCrew}
              onChange={(e) => setAdditionalCrew(e.target.value)}
              placeholder="Pilot/Co-Pilot Name"
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black">Cabin Crew</label>
            <input
              type="text"
              value={cabinCrew}
              onChange={(e) => setCabinCrew(e.target.value)}
              placeholder="Cabin Crew Names"
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black">Arrival Time</label>
            <input
              type="time"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black">Flight Duty Hours</label>
            <input
              type="text"
              value={dutyHours}
              onChange={(e) => setDutyHours(e.target.value)}
              placeholder="6 hours 35 min"
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            />
            <a href="#" className="text-xs text-blue-600 underline mt-1 inline-block">
              Click here to validate FAA duty hour requirements.
            </a>
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
