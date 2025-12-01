"use client";

import { useEffect, useState, FormEvent } from "react";
import EngineerSidebar from "@/app/components/sidebars/EngineerSidebar";
import Link from "next/link";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type EngineerReport = {
  id: number;
  title: string;
  job_id?: number | null;
  aircraft_registration?: string | null;
  summary?: string | null;
  findings?: string | null;
  created_at?: string;
  status?: string; // e.g. "draft", "submitted", "closed"
};

export default function EngineerReportsPage() {
  const [reports, setReports] = useState<EngineerReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // form state
  const [title, setTitle] = useState("");
  const [jobId, setJobId] = useState("");
  const [summary, setSummary] = useState("");
  const [findings, setFindings] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE_URL}/api/engineer/reports`, {
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error("You must be logged in as engineer to view reports.");
        }
        throw new Error(`Failed to load reports (${res.status})`);
      }

      const data: EngineerReport[] = await res.json();
      setReports(data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleCreateReport = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!title.trim()) {
      setSubmitError("Title is required.");
      return;
    }

    setSubmitting(true);
    try {
      const body: any = {
        title: title.trim(),
        summary: summary.trim() || null,
        findings: findings.trim() || null,
      };

      if (jobId.trim()) {
        const parsed = Number(jobId.trim());
        if (!Number.isNaN(parsed)) {
          body.job_id = parsed;
        }
      }

      const res = await fetch(`${API_BASE_URL}/api/engineer/reports`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error("You are not authorized to create reports.");
        }
        const text = await res.text();
        throw new Error(
          `Failed to create report (${res.status}): ${text || "Unknown error"}`
        );
      }

      setSubmitSuccess("Report created successfully.");
      setTitle("");
      setJobId("");
      setSummary("");
      setFindings("");

      // reload list
      await loadReports();
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || "Failed to create report.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <EngineerSidebar />

      <div className="flex-1 bg-gray-100 p-10">
        <h1 className="text-3xl font-semibold text-black mb-2">
          Maintenance Reports
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Create and manage engineering maintenance reports.
        </p>

        {/* LIST + FORM LAYOUT */}
        <div className="grid gap-6 lg:grid-cols-[2fr,1.2fr]">
          {/* LEFT: Reports table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-black">
                Existing Reports
              </h2>
              <span className="text-xs text-gray-500">
                Total: {reports.length}
              </span>
            </div>

            {loading && (
              <p className="text-sm text-gray-600">Loading reports…</p>
            )}

            {error && !loading && (
              <div className="mb-3 rounded-md bg-red-100 px-4 py-2 text-sm text-red-800">
                {error}
              </div>
            )}

            {!loading && !error && reports.length === 0 && (
              <p className="text-sm text-gray-600">
                No reports found. Create your first report using the form on the
                right.
              </p>
            )}

            {!loading && !error && reports.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm text-gray-800">
                  <thead>
                    <tr className="border-b text-xs uppercase text-gray-500">
                      <th className="py-2 pr-4">ID</th>
                      <th className="py-2 pr-4">Title</th>
                      <th className="py-2 pr-4">Job ID</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Created</th>
                      <th className="py-2 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((r) => (
                      <tr key={r.id} className="border-b last:border-none">
                        <td className="py-2 pr-4 text-black">#{r.id}</td>
                        <td className="py-2 pr-4 text-black max-w-xs truncate">
                          {r.title}
                        </td>
                        <td className="py-2 pr-4 text-black">
                          {r.job_id ?? "—"}
                        </td>
                        <td className="py-2 pr-4 text-black">
                          {r.status ?? "—"}
                        </td>
                        <td className="py-2 pr-4 text-black">
                          {r.created_at
                            ? new Date(r.created_at).toLocaleString()
                            : "—"}
                        </td>
                        <td className="py-2 pr-4 text-right">
                          <Link
                            href={`/engineer/reports/${r.id}`}
                            className="border border-black px-3 py-1 rounded-full text-xs text-black hover:bg-black hover:text-white transition"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* RIGHT: Create report form */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-lg font-semibold text-black mb-3">
              Create New Report
            </h2>
            <p className="text-xs text-gray-600 mb-3">
              Fill in the details below to create a new maintenance report
              linked to a job (optional).
            </p>

            {submitError && (
              <div className="mb-3 rounded-md bg-red-100 px-4 py-2 text-sm text-red-800">
                {submitError}
              </div>
            )}
            {submitSuccess && (
              <div className="mb-3 rounded-md bg-green-100 px-4 py-2 text-sm text-green-800">
                {submitSuccess}
              </div>
            )}

            <form onSubmit={handleCreateReport} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="e.g. A-Check findings for A320-XYZ"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Job ID (optional)
                </label>
                <input
                  type="number"
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Link this report to a job"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Summary
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={2}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black resize-none"
                  placeholder="Short summary of this report."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Findings / Notes
                </label>
                <textarea
                  value={findings}
                  onChange={(e) => setFindings(e.target.value)}
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="Detailed findings, observations, and remarks."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center w-full rounded-full border border-black px-4 py-2 text-xs font-medium text-black hover:bg-black hover:text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Creating…" : "Create Report"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}