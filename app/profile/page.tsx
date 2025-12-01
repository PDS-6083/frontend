"use client";

import useUser from "@/app/hooks/useUser";
import ProfileCard from "@/app/components/ProfileCard";
import { FaUserCircle } from "react-icons/fa";

export default function ProfilePage() {
  const { user, loading } = useUser();

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Not logged in</p>;

  return (
    <div className="flex min-h-screen bg-gray-100 p-10">
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
  );
}
