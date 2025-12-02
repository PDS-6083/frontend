"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import EngineerSidebar from "@/app/components/sidebars/EngineerSidebar";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Types
type MaintenanceType = "routine" | "inspection" | "repair" | "overhaul";

type MaintenanceJobSummary = {
  job_id: number;
  aircraft_registration: string;
  role: string;
  checkin_date: string;
  checkout_date: string | null;
  status: string;
  type: MaintenanceType;
};

type EngineerInfo = {
  email_id: string;
  name: string;
  role: string;
};

type JobPartInfo = {
  part_number: string;
  part_manufacturer: string;
  model: string;
  manufacturing_date: string;
};

type MaintenanceJobDetail = {
  job_id: number;
  aircraft_registration: string;
  checkin_date: string;
  checkout_date: string | null;
  status: string;
  type: MaintenanceType;
  remarks?: string | null;

  engineers: EngineerInfo[];
  parts: JobPartInfo[];
};

type NewJobForm = {
  aircraft_registration: string;
  type: MaintenanceType;
  remarks: string;
};

type AssignEngineerForm = {
  email_id: string;
  role: string;
};

// From engineer dashboard backend
type EngineerAircraft = {
  registration_number: string;
  status: string;
};

type EngineerDashboardResponse = {
  aircrafts: EngineerAircraft[];
};

export default function EngineerMaintenancePage() {
  const router = useRouter();

  const [jobs, setJobs] = useState<MaintenanceJobSummary[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState<string | null>(null);

  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [selectedJob, setSelectedJob] = useState<MaintenanceJobDetail | null>(
    null
  );
  const [jobDetailLoading, setJobDetailLoading] = useState(false);
  const [jobDetailError, setJobDetailError] = useState<string | null>(null);

  const [newJob, setNewJob] = useState<NewJobForm>({
    aircraft_registration: "",
    type: "routine",
    remarks: "",
  });

  const [assignForm, setAssignForm] = useState<AssignEngineerForm>({
    email_id: "",
    role: "Engineer",
  });

  const [creatingJob, setCreatingJob] = useState(false);
  const [createJobError, setCreateJobError] = useState<string | null>(null);

  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);

  // NEW: aircraft list for dropdown
  const [aircrafts, setAircrafts] = useState<EngineerAircraft[]>([]);
  const [aircraftsLoading, setAircraftsLoading] = useState(true);
  const [aircraftsError, setAircraftsError] = useState<string | null>(null);

  // ------------------------------
  // Load jobs
  // ------------------------------
  async function loadJobs() {
    setJobsLoading(true);
    setJobsError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/engineer/jobs`, {
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.push("/403");
          return;
        }
        setJobsError(`Failed to load jobs (${res.status})`);
        return;
      }

      const data: MaintenanceJobSummary[] = await res.json();
      setJobs(data);

      if (!selectedJobId && data.length > 0) {
        setSelectedJobId(data[0].job_id);
      }
    } catch (err) {
      console.error(err);
      setJobsError("Unexpected error while loading jobs.");
    } finally {
      setJobsLoading(false);
    }
  }

  // ------------------------------
  // Load aircrafts for dropdown
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
    loadJobs();
    loadAircrafts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------------------
  // Load job detail
  // ------------------------------
  useEffect(() => {
    if (!selectedJobId) {
      setSelectedJob(null);
      return;
    }

    async function loadJobDetail(jobId: number) {
      setJobDetailLoading(true);
      setJobDetailError(null);

      try {
        const res = await fetch(
          `${API_BASE_URL}/api/engineer/jobs/${jobId}`,
          { credentials: "include" }
        );

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            router.push("/403");
            return;
          }
          if (res.status === 404) {
            setJobDetailError("Job not found.");
            return;
          }
          setJobDetailError(`Failed to load job detail (${res.status})`);
          return;
        }

        const data: MaintenanceJobDetail = await res.json();
        setSelectedJob(data);
      } catch (err) {
        console.error(err);
        setJobDetailError("Unexpected error loading job detail.");
      } finally {
        setJobDetailLoading(false);
      }
    }

    loadJobDetail(selectedJobId);
  }, [selectedJobId, router]);

  // ------------------------------
  // Create job
  // ------------------------------
  async function handleCreateJob(e: FormEvent) {
    e.preventDefault();
    setCreatingJob(true);
    setCreateJobError(null);

    try {
      const payload = {
        aircraft_registration: newJob.aircraft_registration.trim(),
        type: newJob.type,
        remarks: newJob.remarks.trim() || null,
      };

      if (!payload.aircraft_registration) {
        setCreateJobError("Please select an aircraft.");
        setCreatingJob(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/engineer/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.push("/403");
          return;
        }
        const body = await res.json().catch(() => null);
        setCreateJobError(
          body?.detail || body?.message || `Failed to create job (${res.status})`
        );
        return;
      }

      const created: MaintenanceJobDetail = await res.json();
      await loadJobs();
      setSelectedJobId(created.job_id);
      setSelectedJob(created);

      setNewJob({
        aircraft_registration: "",
        type: "routine",
        remarks: "",
      });
    } catch (err) {
      console.error(err);
      setCreateJobError("Unexpected error while creating job.");
    } finally {
      setCreatingJob(false);
    }
  }

  // ------------------------------
  // Assign engineer
  // ------------------------------
  async function handleAssignEngineer(e: FormEvent) {
    e.preventDefault();
    if (!selectedJobId) return;

    setAssigning(true);
    setAssignError(null);

    try {
      const payload = {
        engineers: [
          {
            email_id: assignForm.email_id.trim(),
            role: assignForm.role.trim(),
          },
        ],
      };

      const res = await fetch(
        `${API_BASE_URL}/api/engineer/jobs/${selectedJobId}/assign-engineers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          router.push("/403");
          return;
        }

        const body = await res.json().catch(() => null);
        setAssignError(
          body?.detail || body?.message || "Failed to assign engineer."
        );
        return;
      }

      const updated: MaintenanceJobDetail = await res.json();
      setSelectedJob(updated);

      setAssignForm({ email_id: "", role: "Engineer" });
    } catch (err) {
      console.error(err);
      setAssignError("Unexpected error while assigning engineer.");
    } finally {
      setAssigning(false);
    }
  }

  // ------------------------------
  // Render UI
  // ------------------------------
  return (
    <div className="flex min-h-screen bg-gray-100">
      <EngineerSidebar />

      <main className="flex-1 p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Maintenance Jobs</h1>
          <p className="text-sm text-gray-600">
            Manage and assign maintenance jobs.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* LEFT: Jobs List */}
          <section className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Jobs List</h2>
              <button
                onClick={loadJobs}
                className="text-xs text-blue-600 hover:underline"
              >
                Refresh
              </button>
            </div>

            {jobsLoading && <p>Loading jobs…</p>}
            {jobsError && <p className="text-red-600">{jobsError}</p>}

            {!jobsLoading && !jobsError && jobs.length === 0 && (
              <p>No jobs found.</p>
            )}

            {!jobsLoading && !jobsError && jobs.length > 0 && (
              <ul className="divide-y">
                {jobs.map((job) => (
                  <li
                    key={job.job_id}
                    className={`p-2 cursor-pointer ${
                      selectedJobId === job.job_id
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedJobId(job.job_id)}
                  >
                    <div className="font-semibold">
                      #{job.job_id} — {job.aircraft_registration}
                    </div>
                    <div className="text-xs text-gray-500">
                      {job.type} ·{" "}
                      {new Date(job.checkin_date).toLocaleDateString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* RIGHT: Job Detail */}
          <section className="lg:col-span-2 bg-white rounded-lg p-4 shadow-sm">
            {!selectedJobId && <p>Select a job to view details.</p>}

            {selectedJobId && jobDetailLoading && <p>Loading detail…</p>}
            {jobDetailError && (
              <p className="text-red-600">{jobDetailError}</p>
            )}

            {selectedJob && (
              <>
                <h2 className="text-lg font-semibold mb-3">Job Detail</h2>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>Job ID: #{selectedJob.job_id}</div>
                  <div>Aircraft: {selectedJob.aircraft_registration}</div>
                  <div>Type: {selectedJob.type}</div>
                  <div>Status: {selectedJob.status}</div>
                  <div>
                    Check-in:{" "}
                    {new Date(selectedJob.checkin_date).toLocaleString()}
                  </div>
                  <div>
                    Check-out:{" "}
                    {selectedJob.checkout_date
                      ? new Date(
                          selectedJob.checkout_date
                        ).toLocaleString()
                      : "—"}
                  </div>
                </div>

                {/* Remarks */}
                <div className="mt-4">
                  <strong>Remarks:</strong>{" "}
                  {selectedJob.remarks || "—"}
                </div>

                {/* Engineers */}
                <div className="mt-4">
                  <strong>Engineers Assigned:</strong>
                  {selectedJob.engineers.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No engineers assigned.
                    </p>
                  ) : (
                    <ul className="text-sm list-disc ml-4">
                      {selectedJob.engineers.map((eng) => (
                        <li key={eng.email_id}>
                          {eng.name} ({eng.role}) — {eng.email_id}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Assign Engineer */}
                <form onSubmit={handleAssignEngineer} className="mt-4">
                  {assignError && (
                    <p className="text-red-600 text-sm mb-2">{assignError}</p>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="email"
                      placeholder="Engineer email"
                      value={assignForm.email_id}
                      onChange={(e) =>
                        setAssignForm((prev) => ({
                          ...prev,
                          email_id: e.target.value,
                        }))
                      }
                      className="border px-2 py-1 rounded"
                    />

                    <input
                      type="text"
                      placeholder="Role"
                      value={assignForm.role}
                      onChange={(e) =>
                        setAssignForm((prev) => ({
                          ...prev,
                          role: e.target.value,
                        }))
                      }
                      className="border px-2 py-1 rounded"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={assigning}
                    className="mt-3 bg-blue-600 text-white px-4 py-2 rounded text-sm"
                  >
                    {assigning ? "Assigning…" : "Assign Engineer"}
                  </button>
                </form>
              </>
            )}
          </section>
        </div>

        {/* Create new job */}
        <section className="mt-6 bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-lg font-semibold">Create New Job</h2>

          {createJobError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-2 text-sm rounded mb-3">
              {createJobError}
            </div>
          )}

          {/* Aircraft load errors (for dropdown) */}
          {aircraftsError && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-2 text-xs rounded mb-3">
              {aircraftsError}
            </div>
          )}

          <form onSubmit={handleCreateJob} className="grid grid-cols-3 gap-4">
            {/* Aircraft dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aircraft
              </label>
              <select
                value={newJob.aircraft_registration}
                onChange={(e) =>
                  setNewJob((prev) => ({
                    ...prev,
                    aircraft_registration: e.target.value,
                  }))
                }
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
                  <option key={ac.registration_number} value={ac.registration_number}>
                    {ac.registration_number} ({ac.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={newJob.type}
                onChange={(e) =>
                  setNewJob((prev) => ({
                    ...prev,
                    type: e.target.value as MaintenanceType,
                  }))
                }
                className="border px-3 py-2 rounded w-full text-sm"
              >
                <option value="routine">Routine</option>
                <option value="inspection">Inspection</option>
                <option value="repair">Repair</option>
                <option value="overhaul">Overhaul</option>
              </select>
            </div>

            {/* Remarks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks (optional)
              </label>
              <input
                type="text"
                placeholder="Short notes for this job"
                value={newJob.remarks}
                onChange={(e) =>
                  setNewJob((prev) => ({
                    ...prev,
                    remarks: e.target.value,
                  }))
                }
                className="border px-3 py-2 rounded w-full text-sm"
              />
            </div>

            <div className="col-span-3">
              <button
                type="submit"
                disabled={creatingJob}
                className="bg-green-600 text-white px-4 py-2 rounded text-sm"
              >
                {creatingJob ? "Creating…" : "Create Job"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}