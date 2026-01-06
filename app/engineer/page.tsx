"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EngineerSidebar from "@/app/components/sidebars/EngineerSidebar";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Match backend: app/engineer/schemas.py
type EngineerProfile = {
  email_id?: string;
  email?: string;
  name: string;
  phone?: string | null;
  license_number?: string | null;
};

type DashboardAircraftItem = {
  registration_number: string;
  status: string; // "active" | "maintenance" | "retired"
};

type DashboardAssignedJobItem = {
  job_id: number;
  aircraft_registration: string;
  role: string;
  checkin_date: string; // ISO datetime from backend
};

type EngineerDashboardStats = {
  monthly_completed_jobs: number;
};

type EngineerDashboardResponse = {
  aircrafts: DashboardAircraftItem[];
  assigned_jobs: DashboardAssignedJobItem[];
  stats: EngineerDashboardStats;
};

export default function EngineerDashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<EngineerProfile | null>(null);
  const [dashboard, setDashboard] = useState<EngineerDashboardResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setProfileError(null);
      setDashboardError(null);

      try {
        // ✅ /api/me for logged-in user
        const profileRes = await fetch(`${API_BASE_URL}/api/me`, {
          credentials: "include",
        });

        if (!profileRes.ok) {
          if (profileRes.status === 401 || profileRes.status === 403) {
            // 🔁 same behaviour as admin/scheduler: go to /403
            router.push("/403");
            return;
          } else {
            setProfileError(`Failed to load profile (${profileRes.status})`);
          }
        } else {
          const profileData = await profileRes.json();
          setProfile(profileData as EngineerProfile);
        }

        // ✅ Engineer dashboard endpoint
        const dashboardRes = await fetch(
          `${API_BASE_URL}/api/engineer/dashboard`,
          {
            credentials: "include",
          }
        );

        if (!dashboardRes.ok) {
          if (dashboardRes.status === 401 || dashboardRes.status === 403) {
            router.push("/403");
            return;
          } else {
            setDashboardError(
              `Failed to load dashboard (${dashboardRes.status})`
            );
          }
        } else {
          const dashboardData = await dashboardRes.json();
          setDashboard(dashboardData as EngineerDashboardResponse);
        }
      } catch (err) {
        console.error(err);
        if (!profileError) {
          setProfileError("Unexpected error while loading engineer data.");
        }
        if (!dashboardError) {
          setDashboardError("Unexpected error while loading dashboard data.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <EngineerSidebar />

      <div className="flex-1 p-6 md:p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Engineer Dashboard
            </h1>
            {profile && (
              <p className="mt-1 text-sm text-gray-600">
                Welcome, <span className="font-medium">{profile.name}</span>
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Link
              href="/engineer/profile"
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              View Profile
            </Link>
            <Link
              href="/engineer/maintenance"
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Maintenance Jobs
            </Link>
          </div>
        </div>

        {/* Loading & error states */}
        {loading && (
          <p className="text-sm text-gray-600">Loading engineer data…</p>
        )}

        {!loading && (profileError || dashboardError) && (
          <div className="mb-4 space-y-2">
            {profileError && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                {profileError}
              </div>
            )}
            {dashboardError && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                {dashboardError}
              </div>
            )}
          </div>
        )}

        {/* Main content */}
        {!loading && !dashboardError && dashboard && (
          <>
            {/* Stats */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-gray-500">
                  Jobs Completed (This Month)
                </p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {dashboard.stats?.monthly_completed_jobs ?? 0}
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Assigned Jobs */}
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Assigned Jobs
                  </h2>
                  <Link
                    href="/engineer/maintenance"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    View All Jobs
                  </Link>
                </div>

                {dashboard.assigned_jobs.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No jobs assigned to you currently.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">
                            Job ID
                          </th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">
                            Aircraft
                          </th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">
                            Role
                          </th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">
                            Check-in
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {dashboard.assigned_jobs.map((job) => (
                          <tr key={job.job_id}>
                            <td className="whitespace-nowrap px-3 py-2">
                              <Link
                                href="/engineer/maintenance"
                                className="text-blue-600 hover:underline"
                              >
                                #{job.job_id}
                              </Link>
                            </td>
                            <td className="whitespace-nowrap px-3 py-2">
                              {job.aircraft_registration}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2">
                              {job.role}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2">
                              {new Date(
                                job.checkin_date
                              ).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Aircrafts */}
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <h2 className="mb-3 text-lg font-semibold text-gray-900">
                  Your Aircrafts
                </h2>

                {dashboard.aircrafts.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No aircrafts assigned to you currently.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">
                            Registration
                          </th>
                          <th className="px-3 py-2 text-left font-medium text-gray-500">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {dashboard.aircrafts.map((ac) => (
                          <tr key={ac.registration_number}>
                            <td className="whitespace-nowrap px-3 py-2">
                              {ac.registration_number}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2 capitalize">
                              {ac.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}