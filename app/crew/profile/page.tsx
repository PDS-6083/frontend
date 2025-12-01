"use client";

import { useEffect, useState } from "react";
import CrewSidebar from "@/app/components/sidebars/CrewSidebar";

type CrewProfile = {
  email_id?: string;
  email?: string;
  name: string;
  phone?: string | null;
  is_pilot?: boolean;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function CrewProfilePage() {
  const [profile, setProfile] = useState<CrewProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/crew/me`, {
          credentials: "include",
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            setError("You must be logged in as crew to view this page.");
          } else {
            setError(`Failed to load profile (${res.status})`);
          }
          return;
        }

        const data: CrewProfile = await res.json();
        setProfile(data);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while loading your profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const displayEmail =
    profile?.email || profile?.email_id || "email not available";
  const role = profile?.is_pilot ? "Pilot" : "Crew";

  return (
    <div className="flex min-h-screen">
      <CrewSidebar />

      <div className="flex-1 bg-gray-100 p-10">
        <h1 className="text-3xl font-semibold text-black mb-2">My Profile</h1>
        <p className="text-sm text-gray-600 mb-6">
          View your personal and contact information.
        </p>

        {loading && (
          <p className="text-gray-600 text-sm mb-4">Loading profile…</p>
        )}

        {error && !loading && (
          <div className="mb-4 rounded-md bg-red-100 px-4 py-2 text-sm text-red-800">
            {error}
          </div>
        )}

        {!loading && !error && profile && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-xl">
            <div className="space-y-4 text-sm text-gray-800">
              <div>
                <div className="text-xs text-gray-500">Name</div>
                <div className="mt-1 text-base font-semibold text-black">
                  {profile.name}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Email</div>
                <div className="mt-1 text-base font-medium text-black">
                  {displayEmail}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Role</div>
                <div className="mt-1 text-base font-medium text-black">
                  {role}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500">Phone</div>
                <div className="mt-1 text-base font-medium text-black">
                  {profile.phone || "—"}
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && !profile && (
          <p className="text-sm text-gray-600">No profile data found.</p>
        )}
      </div>
    </div>
  );
}