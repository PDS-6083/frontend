"use client";

import { useEffect, useState } from "react";
import CrewSidebar from "@/app/components/sidebars/EngineerSidebar";
import ProfileCard from "@/app/components/ProfileCard";
import { FaUserCircle } from "react-icons/fa";

type User = {
  name: string;
  phone?: string;
  email: string;
  user_type: string;
  employeeId?: string;
};

export default function CrewProfile() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/me`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          console.error("Failed to load Engineer profile:", res.status);
          return;
        }

        const data = await res.json();
        setUser({
          name: data.name,
          email: data.email,
          user_type: data.user_type,
          phone: data.phone ?? "N/A",
          employeeId: data.id,
        });
      } catch (error) {
        console.error("Error fetching Engineer profile:", error);
      }
    }

    loadUser();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <CrewSidebar />

      {/* Main content */}
      <div className="flex-1 bg-gray-100 p-10">
        <h1 className="text-3xl font-semibold mb-6 text-black">My Profile</h1>

        <div className="flex space-x-10">
          {/* User Icon */}
          <FaUserCircle className="text-purple-600" size={120} />

          {/* Shared Profile Card */}
          <ProfileCard
            name={user?.name ?? "Loading..."}
            phone={user?.phone ?? "Loading..."}
            role={user?.user_type ?? "Loading..."}
            email={user?.email ?? "Loading..."}
            employeeId={user?.employeeId ?? "Loading..."}
          />
        </div>
      </div>
    </div>
  );
}