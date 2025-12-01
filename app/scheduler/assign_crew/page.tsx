"use client";

import { useEffect, useState } from "react";
import SchedulerSidebar from "@/app/components/sidebars/SchedulerSidebar";
import useRoleGuard from "@/app/hooks/useRoleGuard";

type Tab = "assign" | "view" | "update" | "remove";

interface CrewMember {
  email_id: string;
  name: string;
  phone?: string;
  is_pilot: boolean;
}

interface Flight {
  flight_number: string;
  route_id: number;
  date: string; // "YYYY-MM-DD"
  scheduled_departure_time: string; // "HH:MM:SS"
  scheduled_arrival_time: string;   // "HH:MM:SS"
  aircraft_registration: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AssignCrewPage() {
  useRoleGuard(["scheduler"]);

  const [currentTab, setCurrentTab] = useState<Tab>("assign");

  const [flights, setFlights] = useState<Flight[]>([]);
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [currentCrew, setCurrentCrew] = useState<CrewMember[]>([]);

  // flight selection is (flight_number + date) combined
  const [selectedFlightKey, setSelectedFlightKey] = useState("");

  // form fields
  const [pilot, setPilot] = useState("");
  const [coPilot, setCoPilot] = useState("");
  const [cabinCrew, setCabinCrew] = useState<string[]>([]);
  const [remarks, setRemarks] = useState("");

  // ---------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------
  const parseFlightKey = (key: string) => {
    const [flight_number, flight_date] = key.split("__");
    return { flight_number, flight_date };
  };

  const formatTime = (t: string | undefined) => {
    if (!t) return "";
    // backend returns "HH:MM:SS" – only show HH:MM
    return t.slice(0, 5);
  };

  // ---------------------------------------------------------
  // Load flights + crew list
  // ---------------------------------------------------------
  useEffect(() => {
    async function loadData() {
      try {
        // Flights
        const flightsRes = await fetch(`${API_URL}/api/scheduler/flights`, {
          credentials: "include",
        });
        if (flightsRes.ok) {
          const flightsJson = await flightsRes.json();
          setFlights(flightsJson);
        } else {
          console.error("Failed to load flights");
        }

        // Crew
        const crewRes = await fetch(`${API_URL}/api/scheduler/crew`, {
          credentials: "include",
        });
        if (crewRes.ok) {
          const crewJson = await crewRes.json();
          setCrew(crewJson);
        } else {
          console.error("Failed to load crew");
        }
      } catch (err) {
        console.error("Failed to load scheduler data:", err);
      }
    }

    loadData();
  }, []);

  // ---------------------------------------------------------
  // When flight changes → load its current crew (for view/update)
  // ---------------------------------------------------------
  useEffect(() => {
    async function loadCrewForFlight() {
      if (!selectedFlightKey) {
        setCurrentCrew([]);
        return;
      }

      const { flight_number, flight_date } = parseFlightKey(selectedFlightKey);

      try {
        const res = await fetch(
          `${API_URL}/api/scheduler/flights/${flight_number}/crew?flight_date=${flight_date}`,
          { credentials: "include" }
        );

        if (res.ok) {
          const data = await res.json();
          setCurrentCrew(data);
        } else if (res.status === 404) {
          // No crew / flight not found
          setCurrentCrew([]);
        } else {
          console.error("Failed to load crew for flight");
        }
      } catch (err) {
        console.error("Error fetching flight crew:", err);
      }
    }

    loadCrewForFlight();
  }, [selectedFlightKey]);

  // ---------------------------------------------------------
  // Validations
  // ---------------------------------------------------------
  const validateCrewForm = () => {
    if (!selectedFlightKey) {
      alert("Please select a flight.");
      return false;
    }
    if (!pilot) {
      alert("Please select a pilot.");
      return false;
    }
    if (!coPilot) {
      alert("Please select a co-pilot.");
      return false;
    }
    if (pilot === coPilot) {
      alert("Pilot and co-pilot must be different.");
      return false;
    }
    if (cabinCrew.length === 0) {
      alert("Please select at least one cabin crew member.");
      return false;
    }

    // Prevent duplicates and overlapping roles
    const all = [pilot, coPilot, ...cabinCrew];
    const unique = new Set(all);
    if (unique.size !== all.length) {
      alert("A crew member cannot be assigned multiple roles.");
      return false;
    }

    return true;
  };

  // ---------------------------------------------------------
  // ASSIGN / UPDATE crew (same backend route, overwrite behavior)
  // ---------------------------------------------------------
  const handleSaveCrew = async () => {
    if (!validateCrewForm()) return;

    const { flight_number, flight_date } = parseFlightKey(selectedFlightKey);
    const crewEmails = [pilot, coPilot, ...cabinCrew];

    try {
      const res = await fetch(
        `${API_URL}/api/scheduler/flights/${flight_number}/crew?flight_date=${flight_date}`,
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

      alert(
        currentTab === "assign"
          ? "Crew assigned successfully!"
          : "Crew updated successfully!"
      );

      // Refresh currentCrew for view/update tab
      const updated = await res.json();
      setCurrentCrew(updated.crew ?? []);

    } catch (err) {
      console.error("Assign/update crew error:", err);
      alert("Network error");
    }
  };

  // ---------------------------------------------------------
  // REMOVE crew assignment → delete flight (backend design)
  // ---------------------------------------------------------
  const handleDeleteAssignment = async () => {
    if (!selectedFlightKey) {
      alert("Please select a flight.");
      return;
    }

    const { flight_number, flight_date } = parseFlightKey(selectedFlightKey);

    const confirmed = window.confirm(
      `This will delete flight ${flight_number} on ${flight_date} and all its crew assignments. Continue?`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(
        `${API_URL}/api/scheduler/flights/${flight_number}?flight_date=${flight_date}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.status === 204) {
        alert("Flight and its crew assignments deleted successfully.");

        // Remove from local list
        setFlights((prev) =>
          prev.filter(
            (f) =>
              !(
                f.flight_number === flight_number &&
                f.date === flight_date
              )
          )
        );
        setSelectedFlightKey("");
        setCurrentCrew([]);
        setPilot("");
        setCoPilot("");
        setCabinCrew([]);
      } else {
        const err = await res.json();
        alert(err.detail || "Failed to delete flight.");
      }
    } catch (err) {
      console.error("Delete flight error:", err);
      alert("Network error");
    }
  };

  // ---------------------------------------------------------
  // UI rendering helpers
  // ---------------------------------------------------------
  const renderFlightSelect = () => (
    <div>
      <label className="block text-sm font-semibold text-black">Flight</label>
      <select
        value={selectedFlightKey}
        onChange={(e) => setSelectedFlightKey(e.target.value)}
        className="w-full p-2 mt-2 border rounded-md bg-white text-black"
      >
        <option value="">Select Flight</option>
        {flights.map((f) => {
          const key = `${f.flight_number}__${f.date}`;
          return (
            <option key={key} value={key}>
              {f.flight_number} — {f.date} (
              {formatTime(f.scheduled_departure_time)}–
              {formatTime(f.scheduled_arrival_time)})
            </option>
          );
        })}
      </select>
    </div>
  );

  const renderCrewSelectors = () => (
    <>
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
        <label className="block text-sm font-semibold text-black">
          Co-Pilot
        </label>
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
        <label className="block text-sm font-semibold text-black">
          Cabin Crew
        </label>

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
          Hold CTRL (Windows) or CMD (Mac) to select multiple cabin crew
          members.
        </p>
      </div>

      {/* REMARKS (local only, not sent to backend) */}
      <div className="col-span-2">
        <label className="block text-sm font-semibold text-black">
          Remarks
        </label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="w-full h-24 p-3 mt-2 border rounded-md bg-white text-black"
        />
      </div>
    </>
  );

  // ---------------------------------------------------------
  // JSX
  // ---------------------------------------------------------
  return (
    <div className="flex min-h-screen">
      <SchedulerSidebar />

      <div className="flex-1 bg-gray-100 p-10">
        <h1 className="text-3xl font-bold text-black">Assign Crew</h1>
        <p className="text-gray-600 mb-6">
          Manage crew assignments for scheduled flights.
        </p>

        {/* TABS */}
        <div className="flex space-x-3 mb-8">
          {([
            ["assign", "Assign Crew"],
            ["view", "View Assignment"],
            ["update", "Update Crew"],
            ["remove", "Remove Assignment"],
          ] as [Tab, string][]).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium border ${
                currentTab === tab
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-400 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-2 gap-10 max-w-4xl">
          {/* Common: Flight selector always visible */}
          {renderFlightSelect()}

          {/* Extra info about selected flight */}
          <div className="text-sm text-gray-600">
            {selectedFlightKey ? (
              <>
                {(() => {
                  const { flight_number, flight_date } =
                    parseFlightKey(selectedFlightKey);
                  const f = flights.find(
                    (x) =>
                      x.flight_number === flight_number && x.date === flight_date
                  );
                  if (!f) return null;
                  return (
                    <div className="bg-white border rounded-md p-3">
                      <p>
                        <span className="font-semibold text-black">
                          Date:
                        </span>{" "}
                        {f.date}
                      </p>
                      <p>
                        <span className="font-semibold text-black">
                          Time:
                        </span>{" "}
                        {formatTime(f.scheduled_departure_time)}–{" "}
                        {formatTime(f.scheduled_arrival_time)}
                      </p>
                      <p>
                        <span className="font-semibold text-black">
                          Aircraft:
                        </span>{" "}
                        {f.aircraft_registration}
                      </p>
                    </div>
                  );
                })()}
              </>
            ) : (
              <p className="text-gray-500">
                Select a flight to view details and manage crew.
              </p>
            )}
          </div>

          {/* Tab-specific content */}
          {currentTab === "assign" && (
            <>
              {renderCrewSelectors()}
              {/* Buttons */}
              <div className="col-span-2 flex mt-6 space-x-5">
                <button
                  onClick={handleSaveCrew}
                  className="bg-red-500 text-white px-8 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Save
                </button>
                <button
                  className="border border-gray-400 text-black px-8 py-2 rounded-md hover:bg-gray-300 transition"
                  onClick={() => {
                    setPilot("");
                    setCoPilot("");
                    setCabinCrew([]);
                    setRemarks("");
                  }}
                >
                  CANCEL
                </button>
              </div>
              <p className="col-span-2 text-xs text-gray-500 mt-2">
                Note: Saving will overwrite any existing crew assignment for
                this flight.
              </p>
            </>
          )}

          {currentTab === "update" && (
            <>
              {renderCrewSelectors()}
              <div className="col-span-2 flex mt-6 space-x-5">
                <button
                  onClick={handleSaveCrew}
                  className="bg-red-500 text-white px-8 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Update
                </button>
                <button
                  className="border border-gray-400 text-black px-8 py-2 rounded-md hover:bg-gray-300 transition"
                  onClick={() => {
                    setPilot("");
                    setCoPilot("");
                    setCabinCrew([]);
                    setRemarks("");
                  }}
                >
                  CANCEL
                </button>
              </div>
              <p className="col-span-2 text-xs text-gray-500 mt-2">
                Existing crew for this flight (if any) will be replaced with
                your new selection.
              </p>
            </>
          )}

          {currentTab === "view" && (
            <div className="col-span-2">
              <h2 className="text-lg font-semibold text-black mb-3">
                Current Assignment
              </h2>
              {!selectedFlightKey ? (
                <p className="text-gray-500">
                  Select a flight to view its crew assignment.
                </p>
              ) : currentCrew.length === 0 ? (
                <p className="text-gray-500">
                  No crew currently assigned for this flight.
                </p>
              ) : (
                <div className="bg-white border rounded-md p-4">
                  <ul className="space-y-2 text-black text-sm">
                    {currentCrew.map((c) => (
                      <li key={c.email_id}>
                        <span className="font-semibold">
                          {c.is_pilot ? "Pilot/Cockpit" : "Cabin"}:
                        </span>{" "}
                        {c.name} ({c.email_id})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {currentTab === "remove" && (
            <div className="col-span-2">
              <h2 className="text-lg font-semibold text-black mb-3">
                Remove Assignment
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                This operation will <span className="font-semibold">delete the selected flight itself</span> and all
                its crew assignments. This uses your existing backend behavior
                (ON DELETE CASCADE).
              </p>
              <button
                onClick={handleDeleteAssignment}
                className="bg-red-600 text-white px-8 py-2 rounded-md hover:bg-red-700 transition"
              >
                Delete Flight &amp; Crew Assignment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
