"use client";

import { useRouter } from "next/navigation";
import useUser from "@/app/hooks/useUser";
import LogoutButton from "./LogoutButton";
import { FaUser, FaTools, FaTachometerAlt } from "react-icons/fa";

export default function EngineerSidebar() {
  const router = useRouter();
  const { user } = useUser(); // get actual logged-in engineer data

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <div className="w-64 h-screen bg-black text-white flex flex-col py-6 px-4">
      {/* USER INFO */}
      <div className="flex items-center space-x-3 mb-10">
        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-xl">
          {initial}
        </div>
        <div>
          <p className="font-semibold">{user?.name ?? "Loading..."}</p>
          <p className="text-sm text-gray-400">{user?.email ?? "Loading..."}</p>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex flex-col space-y-4">

        {/* Dashboard */}
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center space-x-3 hover:bg-gray-800 py-2 px-3 rounded-md w-full text-left"
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </button>

        {/* Engineer Profile */}
        <button
          onClick={() => router.push("/profile")}
          className="flex items-center space-x-3 hover:bg-gray-800 py-2 px-3 rounded-md w-full text-left"
        >
          <FaUser />
          <span>Profile</span>
        </button>

        {/* Maintenance Jobs */}
        <button
          onClick={() => router.push("/engineer/maintenance")}
          className="flex items-center space-x-3 hover:bg-gray-800 py-2 px-3 rounded-md w-full text-left"
        >
          <FaTools />
          <span>Maintenance Jobs</span>
        </button>

        <LogoutButton />
      </nav>
    </div>
  );
}