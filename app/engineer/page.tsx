"use client";

import { useEffect, useState } from "react";
import EngineerSidebar from "@/app/components/sidebars/EngineerSidebar";
import Link from "next/link";

type EngineerProfile = {
  email_id?: string;
  email?: string;
  name: string;
  phone?: string | null;
  license_number?: string | null;
};

type DashboardAircraftItem = {
  registration_number: string;
  status: string;
};

type DashboardAssignedJobItem = {
  job_id: number;
  aircraft_registration: string;
  role: string;
  checkin_date: string; // ISO datetime
};

type EngineerDashboardStats = {
  monthly_completed_jobs: number;
};

type EngineerDashboardResponse = {
  aircrafts: DashboardAircraftItem[];
  assigned_jobs: DashboardAssignedJobItem[];
  stats: EngineerDashboardStats;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function EngineerHomePage() {
  const [profile, setProfile] = useState<EngineerProfile | null>(null);
  const [dashboard, setDashboard] = useState<EngineerDashboardResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [profileRes, dashboardRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/me`, {
            credentials: "include",
          }),
          fetch(`${API_BASE_URL}/api/engineer/dashboard`, {
            credentials: "include",
          }),
        ]);

        if (!profileRes.ok) {
          throw new Error(
            profileRes.status === 401 || profileRes.status === 403
              ? "Please log in as engineer to view this page."
              : `Failed to load engineer profile (${profileRes.status})`
          );
        }

        if (!dashboardRes.ok) {
          throw new Error(
            dashboardRes.status === 401 || dashboardRes.status === 403
              ? "Please log in as engineer to view this page."
              : `Failed to load engineer dashboard (${dashboardRes.status})`
          );
        }

        const profileData: EngineerProfile = await profileRes.json();
        const dashboardData: EngineerDashboardResponse =
          await dashboardRes.json();

        setProfile(profileData);
        setDashboard(dashboardData);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load engineer home page.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const aircrafts = dashboard?.aircrafts ?? [];
  const assignedJobs = dashboard?.assigned_jobs ?? [];
  const monthlyCompleted = dashboard?.stats?.monthly_completed_jobs ?? 0;

  const displayEmail =
    profile?.email || profile?.email_id || "email not available";

  return (
    <div className="flex min-h-screen">
      <EngineerSidebar />

      <div className="flex-1 bg-gray-100 p-10">
        <h1 className="text-3xl font-semibold text-black mb-2">
          Engineer Dashboard
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Welcome back. View your profile, aircraft overview, and assigned jobs
          at a glance.
        </p>

        {loading && (
          <p className="text-gray-600 text-sm mb-4">
            Loading engineer data…
          </p>
        )}

        {error && !loading && (
          <div className="mb-4 rounded-md bg-red-100 px-4 py-2 text-sm text-red-800">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* TOP: profile + stats */}
            <div className="grid gap-6 md:grid-cols-[1.6fr,1.4fr] mb-8">
              {/* Profile card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h2 className="text-lg font-semibold text-black mb-3">
                  My Profile
                </h2>
                {profile ? (
                  <div className="space-y-2 text-sm text-gray-800">
                    <div>
                      <div className="text-xs text-gray-500">Name</div>
                      <div className="font-medium text-black">
                        {profile.name}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="font-medium text-black">
                        {displayEmail}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Phone</div>
                      <div className="font-medium text-black">
                        {profile.phone || "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">
                        License Number
                      </div>
                      <div className="font-medium text-black">
                        {profile.license_number || "—"}
                      </div>
                    </div>
                    <div className="pt-3">
                      <Link
                        href="/engineer/profile"
                        className="inline-flex items-center px-4 py-2 rounded-full border border-black text-xs font-medium text-black hover:bg-black hover:text-white transition"
                      >
                        View full profile
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    Could not load engineer profile.
                  </p>
                )}
              </div>

              {/* Stats card */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h2 className="text-lg font-semibold text-black mb-3">
                  Maintenance Summary
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="text-xs text-gray-500">
                      Total Aircrafts
                    </div>
                    <div className="mt-1 text-2xl font-bold text-black">
                      {aircrafts.length}
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-3">
                    <div className="text-xs text-gray-500">
                      Active Assigned Jobs
                    </div>
                    <div className="mt-1 text-2xl font-bold text-black">
                      {assignedJobs.length}
                    </div>
                  </div>
                </div>

                <div className="mt-4 border border-gray-200 rounded-lg p-3 text-sm">
                  <div className="text-xs text-gray-500 mb-1">
                    Completed Jobs This Month
                  </div>
                  <div className="text-2xl font-bold text-black">
                    {monthlyCompleted}
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href="/engineer/maintenance"
                    className="inline-flex items-center px-4 py-2 rounded-full border border-black text-xs font-medium text-black hover:bg-black hover:text-white transition"
                  >
                    View detailed maintenance dashboard
                  </Link>
                </div>
              </div>
            </div>

            {/* BOTTOM: assigned jobs preview */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-black">
                  Assigned Jobs (Next few)
                </h2>
                <Link
                  href="/engineer/maintenance"
                  className="text-xs font-medium text-blue-600 hover:underline"
                >
                  See full maintenance view
                </Link>
              </div>

              {assignedJobs.length === 0 ? (
                <p className="text-sm text-gray-600">
                  You have no jobs assigned yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm text-gray-800">
                    <thead>
                      <tr className="border-b text-xs uppercase text-gray-500">
                        <th className="py-2 pr-4">Job ID</th>
                        <th className="py-2 pr-4">Aircraft Reg.</th>
                        <th className="py-2 pr-4">Role</th>
                        <th className="py-2 pr-4">Check-in Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignedJobs.slice(0, 5).map((job) => (
                        <tr
                          key={job.job_id}
                          className="border-b last:border-none"
                        >
                          <td className="py-2 pr-4 text-black">
                            #{job.job_id}
                          </td>
                          <td className="py-2 pr-4 text-black">
                            {job.aircraft_registration}
                          </td>
                          <td className="py-2 pr-4 text-black">{job.role}</td>
                          <td className="py-2 pr-4 text-black">
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
          </>
        )}
      </div>
    </div>
  );
}