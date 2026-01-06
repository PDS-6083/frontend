"use client";

import { useRouter } from "next/navigation";
import useUser from "@/app/hooks/useUser";
import LogoutButton from "./LogoutButton";
import { FaUser, FaPlane, FaTachometerAlt } from "react-icons/fa";

export default function CrewSidebar() {
  const router = useRouter();
  const { user } = useUser(); // grab user from your hook

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <div className="w-64 h-screen bg-black text-white flex flex-col py-6 px-4">
      {/* USER INFO */}
      <div className="flex items-center gap-3 mb-10">
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
        {/* Crew Dashboard -> /crew */}
        <button
          onClick={() => router.push("/crew")}
          className="flex items-center gap-3 hover:bg-gray-800 py-2 px-3 rounded-md w-full text-left"
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </button>

        {/* My Profile -> /crew/profile */}
        <button
          onClick={() => router.push("/profile")}
          className="flex items-center gap-3 hover:bg-gray-800 py-2 px-3 rounded-md w-full text-left"
        >
          <FaUser />
          <span>My Profile</span>
        </button>

        {/* My Flights -> /crew/flights */}
        <button
          onClick={() => router.push("/crew/flights")}
          className="flex items-center gap-3 hover:bg-gray-800 py-2 px-3 rounded-md w-full text-left"
        >
          <FaPlane />
          <span>My Flights</span>
        </button>

        {/* Logout */}
        <LogoutButton />
      </nav>
    </div>
  );
}