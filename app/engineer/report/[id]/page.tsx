"use client";

import { useEffect, useState } from "react";
import EngineerSidebar from "@/app/components/sidebars/EngineerSidebar";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type EngineerReport = {
  id: number;
  title: string;
  job_id?: number | null;
  aircraft_registration?: string | null;
  summary?: string | null;
  findings?: string | null;
  created_at?: string;
  status?: string;
};

export default function EngineerReportDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const reportId = params.id;
  const [report, setReport] = useState<EngineerReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReport() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${API_BASE_URL}/api/engineer/reports/${reportId}`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Report not found.");
          }
          if (res.status === 401 || res.status === 403) {
            throw new Error("You are not authorized to view this report.");
          }
          throw new Error(`Failed to load report (${res.status})`);
        }

        const data: EngineerReport = await res.json();
        setReport(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load report.");
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [reportId]);

  return (
    <div className="flex min-h-screen">
      <EngineerSidebar />

      <div className="flex-1 bg-gray-100 p-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-semibold text-black">
              Report #{reportId}
            </h1>
            <p className="text-sm text-gray-600">
              Detailed view of this maintenance report.
            </p>
          </div>
          <Link
            href="/engineer/reports"
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            ← Back to reports
          </Link>
        </div>

        {loading && (
          <p className="text-gray-600 text-sm mb-4">Loading report…</p>
        )}

        {error && !loading && (
          <div className="mb-4 rounded-md bg-red-100 px-4 py-2 text-sm text-red-800">
            {error}
          </div>
        )}

        {!loading && !error && report && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-3xl">
            <div className="mb-6">
              <div className="text-xs text-gray-500 mb-1">Title</div>
              <div className="text-xl font-semibold text-black">
                {report.title}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mb-6 text-sm text-gray-800">
              <div>
                <div className="text-xs text-gray-500">Report ID</div>
                <div className="mt-1 font-medium text-black">
                  #{report.id}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Job ID</div>
                <div className="mt-1 font-medium text-black">
                  {report.job_id ?? "—"}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Aircraft Reg.</div>
                <div className="mt-1 font-medium text-black">
                  {report.aircraft_registration || "—"}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Status</div>
                <div className="mt-1 font-medium text-black">
                  {report.status || "—"}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Created At</div>
                <div className="mt-1 font-medium text-black">
                  {report.created_at
                    ? new Date(report.created_at).toLocaleString()
                    : "—"}
                </div>
              </div>
            </div>

            {report.summary && (
              <div className="mb-4 text-sm text-gray-800">
                <div className="text-xs text-gray-500 mb-1">Summary</div>
                <p className="whitespace-pre-line">{report.summary}</p>
              </div>
            )}

            {report.findings && (
              <div className="mb-4 text-sm text-gray-800">
                <div className="text-xs text-gray-500 mb-1">
                  Findings / Notes
                </div>
                <p className="whitespace-pre-line">{report.findings}</p>
              </div>
            )}
          </div>
        )}

        {!loading && !error && !report && (
          <p className="text-sm text-gray-600">No report data found.</p>
        )}
      </div>
    </div>
  );
}