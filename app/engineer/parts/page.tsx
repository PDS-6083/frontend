"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EngineerSidebar from "@/app/components/sidebars/EngineerSidebar";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type JobPartInfo = {
  part_number: string;
  part_manufacturer: string;
  model: string;
  manufacturing_date: string;
};

type NewPartForm = {
  part_number: string;
  part_manufacturer: string;
  model: string;
  manufacturing_date: string; // YYYY-MM-DD
};

type EngineerAircraft = {
  registration_number: string;
  status: string;
};

type EngineerDashboardResponse = {
  aircrafts: EngineerAircraft[];
};

type AircraftDetailResponse = {
  parts: JobPartInfo[];
};

export default function EngineerPartsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const preselectedAircraft = searchParams.get("aircraft") || "";

  const [aircrafts, setAircrafts] = useState<EngineerAircraft[]>([]);
  const [aircraftsLoading, setAircraftsLoading] = useState(true);
  const [aircraftsError, setAircraftsError] = useState<string | null>(null);

  const [selectedAircraft, setSelectedAircraft] = useState<string>(
    preselectedAircraft
  );

  const [parts, setParts] = useState<JobPartInfo[]>([]);
  const [partsLoading, setPartsLoading] = useState(false);
  const [partsError, setPartsError] = useState<string | null>(null);

  const [newPart, setNewPart] = useState<NewPartForm>({
    part_number: "",
    part_manufacturer: "",
    model: "",
    manufacturing_date: "",
  });
  const [addingPart, setAddingPart] = useState(false);
  const [addPartError, setAddPartError] = useState<string | null>(null);

  // ------------------------------
  // Load aircrafts
  // ------------------------------
  async function loadAircrafts() {
    setAircraftsLoading(true);
    setAircraftsError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/engineer/dashboard`, {
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.push("/403");
          return;
        }
        setAircraftsError(`Failed to load aircrafts (${res.status})`);
        return;
      }

      const data: EngineerDashboardResponse = await res.json();
      setAircrafts(data.aircrafts || []);
    } catch (err) {
      console.error(err);
      setAircraftsError("Unexpected error while loading aircrafts.");
    } finally {
      setAircraftsLoading(false);
    }
  }

  useEffect(() => {
    loadAircrafts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------------------
  // Load parts for selected aircraft
  // ------------------------------
  async function loadParts(registration: string) {
    if (!registration) return;

    setPartsLoading(true);
    setPartsError(null);

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/engineer/aircrafts/${registration}`,
        { credentials: "include" }
      );

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.push("/403");
          return;
        }
        if (res.status === 404) {
          setPartsError("Aircraft not found.");
          setParts([]);
          return;
        }
        setPartsError(`Failed to load parts (${res.status})`);
        return;
      }

      const data: AircraftDetailResponse = await res.json();
      setParts(data.parts || []);
    } catch (err) {
      console.error(err);
      setPartsError("Unexpected error while loading parts.");
    } finally {
      setPartsLoading(false);
    }
  }

  // After aircrafts loaded, pick default if needed
  useEffect(() => {
    if (!selectedAircraft && aircrafts.length > 0) {
      const first = aircrafts[0].registration_number;
      setSelectedAircraft(first);
      loadParts(first);
    } else if (selectedAircraft) {
      loadParts(selectedAircraft);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aircrafts]);

  // When selected aircraft changes manually
  useEffect(() => {
    if (selectedAircraft) {
      loadParts(selectedAircraft);
    } else {
      setParts([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAircraft]);

  // ------------------------------
  // Add part
  // ------------------------------
  async function handleAddPart(e: FormEvent) {
    e.preventDefault();
    if (!selectedAircraft) return;

    setAddingPart(true);
    setAddPartError(null);

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/engineer/aircrafts/${selectedAircraft}/parts`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPart),
        }
      );

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.push("/403");
          return;
        }
        const errBody = await res.json().catch(() => null);
        const detail =
          errBody?.detail || `Failed to add part (${res.status})`;
        setAddPartError(detail);
        return;
      }

      const created: JobPartInfo = await res.json();
      setParts((prev) => [...prev, created]);

      setNewPart({
        part_number: "",
        part_manufacturer: "",
        model: "",
        manufacturing_date: "",
      });
    } catch (err) {
      console.error(err);
      setAddPartError("Unexpected error while adding part.");
    } finally {
      setAddingPart(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      <EngineerSidebar />

      <main className="flex-1 p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-black">
              Manage Aircraft Parts
            </h1>
            <p className="text-sm text-black/80">
              Add and view parts directly on an aircraft.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/engineer/maintenance")}
            className="px-3 py-2 rounded bg-blue-600 text-white text-sm"
          >
            Back to Maintenance
          </button>
        </div>

        {/* Aircraft selector */}
        <section className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-3">Select Aircraft</h2>

          {aircraftsError && (
            <p className="text-red-600 text-sm mb-2">{aircraftsError}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aircraft
              </label>
              <select
                value={selectedAircraft}
                onChange={(e) => setSelectedAircraft(e.target.value)}
                disabled={aircraftsLoading || aircrafts.length === 0}
                className="border px-3 py-2 rounded w-full text-sm"
              >
                <option value="">
                  {aircraftsLoading
                    ? "Loading aircrafts…"
                    : aircrafts.length === 0
                    ? "No aircrafts available"
                    : "Select an aircraft"}
                </option>
                {aircrafts.map((ac) => (
                  <option
                    key={ac.registration_number}
                    value={ac.registration_number}
                  >
                    {ac.registration_number} ({ac.status})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Parts list */}
        <section className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-3">
            Parts on Aircraft {selectedAircraft || "—"}
          </h2>

          {partsLoading && <p>Loading parts…</p>}
          {partsError && (
            <p className="text-red-600 text-sm mb-2">{partsError}</p>
          )}

          {!partsLoading && !partsError && (
            <table className="w-full text-xs border rounded overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border px-2 py-1 text-left">Part Number</th>
                  <th className="border px-2 py-1 text-left">Manufacturer</th>
                  <th className="border px-2 py-1 text-left">Model</th>
                  <th className="border px-2 py-1 text-left">Mfg Date</th>
                </tr>
              </thead>
              <tbody>
                {parts.length > 0 ? (
                  parts.map((p) => (
                    <tr key={p.part_number}>
                      <td className="border px-2 py-1">{p.part_number}</td>
                      <td className="border px-2 py-1">
                        {p.part_manufacturer}
                      </td>
                      <td className="border px-2 py-1">{p.model}</td>
                      <td className="border px-2 py-1">
                        {p.manufacturing_date}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="border px-2 py-2 text-center text-black/60"
                      colSpan={4}
                    >
                      No parts recorded for this aircraft.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </section>

        {/* Add part */}
        <section className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Add New Part</h2>
          <p className="text-xs text-black/70 mb-3">
            New parts will be added to the currently selected aircraft.
          </p>

          {addPartError && (
            <p className="text-red-600 text-sm mb-2">{addPartError}</p>
          )}

          <form
            onSubmit={handleAddPart}
            className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end text-xs md:text-sm"
          >
            <div>
              <label className="block text-xs mb-1">Part number</label>
              <input
                required
                className="w-full border rounded px-2 py-1"
                value={newPart.part_number}
                onChange={(e) =>
                  setNewPart((prev) => ({
                    ...prev,
                    part_number: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Manufacturer</label>
              <input
                required
                className="w-full border rounded px-2 py-1"
                value={newPart.part_manufacturer}
                onChange={(e) =>
                  setNewPart((prev) => ({
                    ...prev,
                    part_manufacturer: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Model</label>
              <input
                required
                className="w-full border rounded px-2 py-1"
                value={newPart.model}
                onChange={(e) =>
                  setNewPart((prev) => ({
                    ...prev,
                    model: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-xs mb-1">
                Manufacturing date
              </label>
              <input
                type="date"
                required
                className="w-full border rounded px-2 py-1"
                value={newPart.manufacturing_date}
                onChange={(e) =>
                  setNewPart((prev) => ({
                    ...prev,
                    manufacturing_date: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={addingPart || !selectedAircraft}
                className="w-full bg-green-600 text-white px-3 py-2 rounded text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {addingPart ? "Adding…" : "Add Part"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}