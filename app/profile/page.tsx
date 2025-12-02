"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AdminSidebar from "@/app/components/sidebars/AdminSidebar";
import SchedulerSidebar from "@/app/components/sidebars/SchedulerSidebar";
import CrewSidebar from "@/app/components/sidebars/CrewSidebar";
import EngineerSidebar from "@/app/components/sidebars/EngineerSidebar";
// (Optional) import engineer & crew sidebars if needed

import ProfileCard from "@/app/components/ProfileCard";
import { FaUserCircle } from "react-icons/fa";

interface UserResponse {
  id: string;
  name: string;
  email: string;
  user_type: string;
  phone?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/me`,
          { credentials: "include" }
        );

        if (!res.ok) {
          router.push("/login");
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (e) {
        console.error("Failed to load user:", e);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router]);

  if (loading || !user) return <p className="p-10">Loading...</p>;

  // Choose sidebar based on role
  let SidebarComponent = null;
  if (user.user_type === "admin") SidebarComponent = <AdminSidebar />;
  if (user.user_type === "scheduler") SidebarComponent = <SchedulerSidebar />;
  if (user.user_type === "engineer") SidebarComponent = <EngineerSidebar />;
  if (user.user_type === "crew") SidebarComponent = <CrewSidebar />;

  return (
    <div className="flex min-h-screen">
      {/* Dynamic Sidebar */}
      {SidebarComponent}

      {/* Main content */}
      <div className="flex-1 bg-gray-100 p-10">
        <h1 className="text-3xl font-semibold mb-6 text-black">
          My Profile
        </h1>

        <div className="flex space-x-10">
          <FaUserCircle className="text-purple-600" size={120} />

          <ProfileCard
            name={user.name}
            phone={user.phone ?? "N/A"}
            role={user.user_type}
            email={user.email}
            employeeId={user.id}
          />
        </div>
      </div>
    </div>
  );
}
