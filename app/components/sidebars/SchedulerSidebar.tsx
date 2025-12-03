"use client";

import { useRouter } from "next/navigation";
import useUser from "@/app/hooks/useUser";
import { FaUser, FaPlaneDeparture, FaUsersCog, FaTachometerAlt } from "react-icons/fa";
import LogoutButton from "./LogoutButton";

export default function SchedulerSidebar() {
  const router = useRouter();
  const {user} = useUser();

  return (
    <div className="w-64 h-screen bg-black text-white flex flex-col py-6 px-4">

      {/* USER INFO */}
      <div className="flex items-center space-x-3 mb-10">
        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-xl">
          {user ? user.name.charAt(0) : "S"}
        </div>
        <div>
          <p className="font-semibold">{user?.name ?? "Loading..."}</p>
          <p className="text-sm text-gray-400">{user?.email ?? "Loading..."}</p>
        </div>
      </div>

      <nav className="flex flex-col space-y-4">
        <button onClick={() => router.push("/dashboard")}
                className="flex items-center space-x-3 hover:bg-gray-800 py-2 px-3 rounded-md">
          <FaTachometerAlt />
          <span>Dashboard</span>
        </button>

        <button onClick={() => router.push("/profile")}
                className="flex items-center space-x-3 hover:bg-gray-800 py-2 px-3 rounded-md">
          <FaUser />
          <span>Profile</span>
        </button>

        <button onClick={() => router.push("/scheduler/schedule")}
                className="flex items-center space-x-3 hover:bg-gray-800 py-2 px-3 rounded-md">
          <FaPlaneDeparture />
          <span>Schedule Flight</span>
        </button>

        <button onClick={() => router.push("/scheduler/assign_crew")}
                className="flex items-center space-x-3 hover:bg-gray-800 py-2 px-3 rounded-md">
          <FaUsersCog />
          <span>Assign Crew</span>
        </button>
      </nav>

    </div>
  );
}
