"use client";

import { useState } from "react";
import AdminSidebar from "@/app/components/sidebars/AdminSidebar";

export default function AddAircraftPage() {
  const [registration, setRegistration] = useState("");
  const [model, setModel] = useState("");
  const [maxRange, setMaxRange] = useState("");
  const [serviceStart, setServiceStart] = useState("");
  const [cargoConfig, setCargoConfig] = useState("");
  const [company, setCompany] = useState("");
  const [configuration, setConfiguration] = useState("");
  const [companySerial, setCompanySerial] = useState("");
  const [nextMaintenance, setNextMaintenance] = useState("");
  const [remarks, setRemarks] = useState("");

  const handleSave = () => {
    const aircraftData = {
      registration,
      model,
      maxRange,
      serviceStart,
      cargoConfig,
      company,
      configuration,
      companySerial,
      nextMaintenance,
      remarks,
    };

    console.log("Aircraft Data:", aircraftData);

    // Later: send to backend
    // axios.post("/api/aircrafts/add", aircraftData);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar/>

      {/* Main */}
      <div className="flex-1 bg-gray-100 p-10">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-black">Add Aircraft</h1>
        <p className="text-gray-600 mb-10">
          Please fill the following form to add an aircraft to the system.
        </p>

        {/* Form Container */}
        <div className="grid grid-cols-2 gap-10 max-w-4xl">

          {/* Registration */}
          <div>
            <label className="block text-sm font-semibold text-black">Registration</label>
            <input
              type="text"
              value={registration}
              onChange={(e) => setRegistration(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
              placeholder="N176891"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-semibold text-black">Company</label>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            >
              <option value="">Select Company</option>
              <option value="Boeing">Boeing</option>
              <option value="Airbus">Airbus</option>
              <option value="Embraer">Embraer</option>
            </select>
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-semibold text-black">Model</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
              placeholder="B737-Max"
            />
          </div>

          {/* Configuration */}
          <div>
            <label className="block text-sm font-semibold text-black">Configuration</label>
            <select
              value={configuration}
              onChange={(e) => setConfiguration(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            >
              <option value="">Select Configuration</option>
              <option value="Passenger">Passenger Only</option>
              <option value="Cargo">Cargo Only</option>
              <option value="Passenger + Cargo">Passenger + Cargo</option>
            </select>
          </div>

          {/* Max Range */}
          <div>
            <label className="block text-sm font-semibold text-black">Max. Range</label>
            <input
              type="text"
              value={maxRange}
              onChange={(e) => setMaxRange(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
              placeholder="2000 Miles"
            />
          </div>

          {/* Company Serial */}
          <div>
            <label className="block text-sm font-semibold text-black">Company Serial</label>
            <input
              type="text"
              value={companySerial}
              onChange={(e) => setCompanySerial(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
              placeholder="0911210"
            />
          </div>

          {/* Service Start Date */}
          <div>
            <label className="block text-sm font-semibold text-black">Service Start Date</label>
            <input
              type="date"
              value={serviceStart}
              onChange={(e) => setServiceStart(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            />
          </div>

          {/* Next Scheduled Maintenance */}
          <div>
            <label className="block text-sm font-semibold text-black">
              Next Scheduled Maintenance
            </label>
            <input
              type="date"
              value={nextMaintenance}
              onChange={(e) => setNextMaintenance(e.target.value)}
              className="w-full p-2 mt-2 border rounded-md bg-white text-black"
            />
          </div>

          {/* Seat/Cargo Config */}
          <div>
            <label className="block text-sm font-semibold text-black">
              Seat/Cargo Configuration
            </label>
            <input
              type="text"
              value={cargoConfig}
              onChange={(e) => setCargoConfig(e.target.value)}
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

        {/* Buttons */}
        <div className="flex mt-10 space-x-5">
          <button
            onClick={handleSave}
            className="bg-red-500 text-white px-8 py-2 rounded-md hover:bg-red-600 transition"
          >
            Save
          </button>

          <button
            className="border border-gray-400 text-black px-8 py-2 rounded-md hover:bg-gray-300 transition"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
