"use client";

import { useEffect, useState, FormEvent } from "react";
import EngineerSidebar from "@/app/components/sidebars/EngineerSidebar";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Match backend engineer/schemas.py

type MaintenanceType = "routine" | "inspection" | "repair" | "overhaul";

type MaintenanceJobSummary = {
  job_id: number;
  aircraft_registration: string;
  role: string;
  checkin_date: string; // ISO datetime
  checkout_date: string | null; // ISO datetime or null
  status: string; // pending / in_progress / completed / cancelled
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
  manufacturing_date: string; // date
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

export default function EngineerMaintenancePage() {
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
  const [creatingJob, setCreatingJob] = useState(false);
  const [createJobError, setCreateJobError] = useState<string | null>(null);

  const [assignForm, setAssignForm] = useState<AssignEngineerForm>({
    email_id: "",
    role: "Engineer",
  });
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);

  // ------------------------------
  // Load list of jobs
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
          setJobsError("You are not authorized to view maintenance jobs.");
        } else {
          setJobsError(`Failed to load jobs (${res.status})`);
        }
        return;
      }

      const data: MaintenanceJobSummary[] = await res.json();
      setJobs(data);

      // Auto-select first job if none selected
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

  useEffect(() => {
    loadJobs();
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
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          if (res.status === 404) {
            setJobDetailError("Job not found.");
          } else if (res.status === 401 || res.status === 403) {
            setJobDetailError("You are not authorized to view this job.");
          } else {
            setJobDetailError(`Failed to load job detail (${res.status})`);
          }
          setSelectedJob(null);
          return;
        }

        const data: MaintenanceJobDetail = await res.json();
        setSelectedJob(data);
      } catch (err) {
        console.error(err);
        setJobDetailError("Unexpected error while loading job detail.");
        setSelectedJob(null);
      } finally {
        setJobDetailLoading(false);
      }
    }

    loadJobDetail(selectedJobId);
  }, [selectedJobId]);

  // ------------------------------
  // Create new job
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
        setCreateJobError("Aircraft registration is required.");
        setCreatingJob(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/engineer/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const body = await res.json().catch(() => null);
          const detail =
            (body && (body.detail || body.message)) ||
            "Invalid data for creating job.";
          setCreateJobError(detail);
        } else if (res.status === 401 || res.status === 403) {
          setCreateJobError("You are not authorized to create jobs.");
        } else {
          setCreateJobError(`Failed to create job (${res.status})`);
        }
        return;
      }

      const created: MaintenanceJobDetail = await res.json();

      // Refresh list and select the new job
      await loadJobs();
      setSelectedJobId(created.job_id);
      setSelectedJob(created);

      // Reset form
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
  // Assign engineer to job
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
            role: assignForm.role.trim() || "Engineer",
          },
        ],
      };

      if (!payload.engineers[0].email_id) {
        setAssignError("Engineer email is required.");
        setAssigning(false);
        return;
      }

      const res = await fetch(
        `${API_BASE_URL}/api/engineer/jobs/${selectedJobId}/assign-engineers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        if (res.status === 400) {
          const body = await res.json().catch(() => null);
          const detail =
            (body && (body.detail || body.message)) ||
            "Failed to assign engineer.";
          setAssignError(detail);
        } else if (res.status === 401 || res.status === 403) {
          setAssignError("You are not authorized to assign engineers.");
        } else {
          setAssignError(`Failed to assign engineer (${res.status})`);
        }
        return;
      }

      const updated: MaintenanceJobDetail = await res.json();
      setSelectedJob(updated);

      // Reset small form
      setAssignForm({
        email_id: "",
        role: "Engineer",
      });
    } catch (err) {
      console.error(err);
      setAssignError("Unexpected error while assigning engineer.");
    } finally {
      setAssigning(false);
    }
  }

  // ------------------------------
  // NOTE on update/delete:
  // Backend engineer routes do NOT expose PUT/DELETE for /jobs,
  // so this page currently supports:
  //  - list jobs
  //  - view job detail
  //  - create new job
  //  - assign engineers to a job
  // To update/delete jobs, backend endpoints must be added first.
  // ------------------------------

  return (
    <div className="flex min-h-screen bg-gray-100">
      <EngineerSidebar />

      <main className="flex-1 p-6 md:p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Maintenance Jobs
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              View, create, and manage maintenance jobs assigned to you.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Jobs list */}
          <section className="lg:col-span-1 rounded-lg bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Jobs List
              </h2>
              <button
                onClick={loadJobs}
                className="text-xs font-medium text-blue-600 hover:underline"
              >
                Refresh
              </button>
            </div>

            {jobsLoading && (
              <p className="text-sm text-gray-600">Loading jobs…</p>
            )}

            {!jobsLoading && jobsError && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                {jobsError}
              </div>
            )}

            {!jobsLoading && !jobsError && jobs.length === 0 && (
              <p className="text-sm text-gray-500">
                No maintenance jobs found.
              </p>
            )}

            {!jobsLoading && !jobsError && jobs.length > 0 && (
              <ul className="divide-y divide-gray-200 max-h-[420px] overflow-y-auto">
                {jobs.map((job) => {
                  const isSelected = job.job_id === selectedJobId;
                  return (
                    <li
                      key={job.job_id}
                      className={`cursor-pointer px-3 py-2 text-sm ${
                        isSelected
                          ? "bg-blue-50 border-l-4 border-blue-600"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedJobId(job.job_id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">
                          #{job.job_id} – {job.aircraft_registration}
                        </span>
                        <span className="text-xs uppercase text-gray-500">
                          {job.status}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-xs text-gray-600">
                        <span>{job.type}</span>
                        <span>
                          In:{" "}
                          {new Date(job.checkin_date).toLocaleDateString()}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Job detail + assign engineer */}
          <section className="lg:col-span-2 rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">
              Job Detail
            </h2>

            {!selectedJobId && (
              <p className="text-sm text-gray-500">
                Select a job from the left to view its details.
              </p>
            )}

            {selectedJobId && jobDetailLoading && (
              <p className="text-sm text-gray-600">Loading job detail…</p>
            )}

            {selectedJobId && jobDetailError && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                {jobDetailError}
              </div>
            )}

            {selectedJobId && !jobDetailLoading && !jobDetailError && selectedJob && (
              <div className="space-y-4">
                {/* Basic info */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-xs font-medium text-gray-500">
                      Job ID
                    </div>
                    <div className="text-sm text-gray-900">
                      #{selectedJob.job_id}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500">
                      Aircraft
                    </div>
                    <div className="text-sm text-gray-900">
                      {selectedJob.aircraft_registration}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500">
                      Type
                    </div>
                    <div className="text-sm text-gray-900">
                      {selectedJob.type}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500">
                      Status
                    </div>
                    <div className="text-sm text-gray-900">
                      {selectedJob.status}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500">
                      Check-in
                    </div>
                    <div className="text-sm text-gray-900">
                      {new Date(
                        selectedJob.checkin_date
                      ).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500">
                      Check-out
                    </div>
                    <div className="text-sm text-gray-900">
                      {selectedJob.checkout_date
                        ? new Date(
                            selectedJob.checkout_date
                          ).toLocaleString()
                        : "—"}
                    </div>
                  </div>
                </div>

                {/* Remarks */}
                <div>
                  <div className="text-xs font-medium text-gray-500">
                    Remarks
                  </div>
                  <div className="mt-1 text-sm text-gray-900">
                    {selectedJob.remarks || "—"}
                  </div>
                </div>

                {/* Engineers */}
                <div>
                  <div className="mb-1 text-xs font-medium text-gray-500">
                    Assigned Engineers
                  </div>
                  {selectedJob.engineers.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No engineers assigned yet.
                    </p>
                  ) : (
                    <ul className="space-y-1 text-sm text-gray-900">
                      {selectedJob.engineers.map((eng) => (
                        <li key={eng.email_id}>
                          <span className="font-medium">{eng.name}</span>{" "}
                          <span className="text-gray-500">
                            ({eng.role} – {eng.email_id})
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Parts */}
                <div>
                  <div className="mb-1 text-xs font-medium text-gray-500">
                    Parts Used
                  </div>
                  {selectedJob.parts.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No parts recorded for this job.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 text-xs">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-2 py-1 text-left font-medium text-gray-500">
                              Part #
                            </th>
                            <th className="px-2 py-1 text-left font-medium text-gray-500">
                              Manufacturer
                            </th>
                            <th className="px-2 py-1 text-left font-medium text-gray-500">
                              Model
                            </th>
                            <th className="px-2 py-1 text-left font-medium text-gray-500">
                              Mfg Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {selectedJob.parts.map((p) => (
                            <tr key={p.part_number}>
                              <td className="px-2 py-1">{p.part_number}</td>
                              <td className="px-2 py-1">
                                {p.part_manufacturer}
                              </td>
                              <td className="px-2 py-1">{p.model}</td>
                              <td className="px-2 py-1">
                                {new Date(
                                  p.manufacturing_date
                                ).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Assign engineer form */}
                <form
                  onSubmit={handleAssignEngineer}
                  className="mt-4 rounded-md border border-gray-200 p-3"
                >
                  <h3 className="mb-2 text-sm font-semibold text-gray-900">
                    Assign Engineer to this Job
                  </h3>

                  {assignError && (
                    <div className="mb-2 rounded-md bg-red-50 p-2 text-xs text-red-700">
                      {assignError}
                    </div>
                  )}

                  <div className="mb-2 grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Engineer Email
                      </label>
                      <input
                        type="email"
                        className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={assignForm.email_id}
                        onChange={(e) =>
                          setAssignForm((prev) => ({
                            ...prev,
                            email_id: e.target.value,
                          }))
                        }
                        placeholder="engineer@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Role
                      </label>
                      <input
                        type="text"
                        className="mt-1 w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={assignForm.role}
                        onChange={(e) =>
                          setAssignForm((prev) => ({
                            ...prev,
                            role: e.target.value,
                          }))
                        }
                        placeholder="Engineer"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={assigning}
                    className="mt-2 inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {assigning ? "Assigning…" : "Assign Engineer"}
                  </button>
                </form>
              </div>
            )}
          </section>
        </div>

        {/* Create new job */}
        <section className="mt-6 rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            Create New Maintenance Job
          </h2>

          {createJobError && (
            <div className="mb-3 rounded-md bg-red-50 p-3 text-sm text-red-700">
              {createJobError}
            </div>
          )}

          <form onSubmit={handleCreateJob} className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Aircraft Registration
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={newJob.aircraft_registration}
                onChange={(e) =>
                  setNewJob((prev) => ({
                    ...prev,
                    aircraft_registration: e.target.value,
                  }))
                }
                placeholder="e.g., N123AB"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={newJob.type}
                onChange={(e) =>
                  setNewJob((prev) => ({
                    ...prev,
                    type: e.target.value as MaintenanceType,
                  }))
                }
              >
                <option value="routine">Routine</option>
                <option value="inspection">Inspection</option>
                <option value="repair">Repair</option>
                <option value="overhaul">Overhaul</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Remarks (optional)
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={newJob.remarks}
                onChange={(e) =>
                  setNewJob((prev) => ({
                    ...prev,
                    remarks: e.target.value,
                  }))
                }
                placeholder="Short notes for this job"
              />
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={creatingJob}
                className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
              >
                {creatingJob ? "Creating…" : "Create Maintenance Job"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}