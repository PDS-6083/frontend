"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CrewSidebar from "@/app/components/sidebars/CrewSidebar";
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
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
          if (res.status === 401 || res.status === 403) {
            router.push("/403");
            return;
          }
          console.error("Failed to load Crew profile:", res.status);
          return;
        }

        const data = await res.json();

        setUser({
          name: data.name,
          email: data.email,
          user_type: data.user_type,
          phone: data.phone ?? "N/A",
          employeeId: data.id ?? "N/A",
        });
      } catch (error) {
        console.error("Error fetching Crew profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <CrewSidebar />

      {/* Main content */}
      <div className="flex-1 bg-gray-100 p-10">
        <h1 className="mb-6 text-3xl font-semibold text-black">My Profile</h1>

        {loading ? (
          <p className="text-black">Loading profile...</p>
        ) : (
          <div className="flex space-x-10">
            {/* User Icon */}
            <FaUserCircle className="text-blue-600" size={120} />

            {/* Shared Profile Card */}
            <ProfileCard
              name={user?.name ?? "N/A"}
              phone={user?.phone ?? "N/A"}
              role={user?.user_type ?? "N/A"}
              email={user?.email ?? "N/A"}
              employeeId={user?.employeeId ?? "N/A"}
            />
          </div>
        )}
      </div>
    </div>
  );
}