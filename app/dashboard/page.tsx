"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminDashboard from "../components/dashboards/AdminDashboard";
import SchedulerDashboard from "../components/dashboards/SchedulerDashboard";
import CrewDashboard from "../components/dashboards/CrewDashboard";
import EngineerDashboard from "../components/dashboards/EngineerDashboard";

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/me`,
          {
            method: "GET",
            credentials: "include",  // ensures cookie auth
          }
        );

        if (!res.ok) {
          router.push("/login");
          return;
        }

        const data = await res.json();
        setRole(data.user_type?.toLowerCase());
        setLoading(false);
      } catch (error) {
        console.error("Auth error:", error);
        router.push("/login");
      }
    }

    loadUser();
  }, [router]);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <>
      {role === "admin" && <AdminDashboard />}
      {role === "scheduler" && <SchedulerDashboard />}
      {role === "crew" && <CrewDashboard />}
      {role === "engineer" && <EngineerDashboard />}
    </>
  );
}
