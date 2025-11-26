"use client";

import { useState } from "react";
import SchedulerSidebar from "../components/sidebar";

export default function ScheduleFlightPage() {
  // form states
  const [route, setRoute] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [status, setStatus] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [aircraft, setAircraft] = useState("");
  const [seatConfig, setSeatConfig] = useState("");
  const [date, setDate] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleSave = () => {
    const flightData = {
      route,
      date,
      departureTime,
      arrivalTime,
      flightNumber,
      aircraft,
      status,
      seatConfig,
      remarks,
    };

    console.log("Scheduled Flight:", flightData);

    // TODO backend integration:
    // axios.post("/api/scheduler/add-flight", flightData)
  };

  return (
    <div className="flex min-h-screen">
      <SchedulerSidebar />

      <div className="flex-1 bg-gray-100 p-10">
        {/* TITLE */}
        <h1 className="text-3xl font-bold text-black">Schedule a Flight</h1>
        <p className="text-gray-600 mb-10">
          Please fill the following form to add a Flight to the system.
        </p>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-10 max-w-4xl">

          {/* Route */}
          <div>
            <label className="block text-sm font-semibold text-black">Route</label>
            <select
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            >
              <option value="">Select Route</option>
              <option value="JFK-LAX">JFK → LAX</option>
              <option value="IAD-DFW">IAD → DFW</option>
              <option value="ORD-JFK">ORD → JFK</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-black">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            />
          </div>

          {/* Departure Time */}
          <div>
            <label className="block text-sm font-semibold text-black">Departure Time</label>
            <input
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
              placeholder="09:00"
            />
          </div>

          {/* Arrival Time */}
          <div>
            <label className="block text-sm font-semibold text-black">Arrival Time</label>
            <input
              type="time"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
              placeholder="15:35"
            />
          </div>

          {/* Flight Number */}
          <div>
            <label className="block text-sm font-semibold text-black">Flight Number</label>
            <input
              type="text"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
              placeholder="UA220"
            />
          </div>

          {/* Aircraft */}
          <div>
            <label className="block text-sm font-semibold text-black">Aircraft</label>
            <input
              type="text"
              value={aircraft}
              onChange={(e) => setAircraft(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
              placeholder="N12011"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-black">Status</label>
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
              placeholder="Scheduled"
            />
          </div>

          {/* Seat/Cargo Config */}
          <div>
            <label className="block text-sm font-semibold text-black">Seat/Cargo Configuration</label>
            <input
              type="text"
              value={seatConfig}
              onChange={(e) => setSeatConfig(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
              placeholder="110 Econ. 7 Bus. 3 Fir."
            />
          </div>

          {/* Remarks */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-black">Enter Remarks</label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            />
          </div>
        </div>

        {/* BUTTONS */}
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
