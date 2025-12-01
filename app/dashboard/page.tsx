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
  function loadUser() {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("aerosync_user");
    if (!stored) {
      // no user info → go back to login
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(stored);
      setRole(user.user_type); // "admin" | "crew" | "scheduler" | "engineer"
    } catch {
      router.push("/login");
      return;
    } finally {
      setLoading(false);
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
