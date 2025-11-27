"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminDashboard from "../components/dashboards/AdminDashboard";
import SchedulerDashboard from "../components/dashboards/SchedulerDashboard";

export default function DashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("http://localhost:8000/api/auth/me", {
          method: "GET",
          credentials: "include",     // ⬅ IMPORTANT: sends `auth_token` cookie
        });

        if (!res.ok) {
          router.push("/login");
          return;
        }

        const data = await res.json();
        setRole(data.user_type);
        setLoading(false);
      } catch (error) {
        router.push("/login");
      }
    }

    loadUser();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <>
      {role === "admin" && <AdminDashboard />}
      {role === "scheduler" && <SchedulerDashboard />}
    </>
  );
}
