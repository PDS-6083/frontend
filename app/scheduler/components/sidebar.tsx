"use client";

import { useRouter } from "next/navigation";
import { 
  FaUser, 
  FaTachometerAlt, 
  FaPlaneDeparture, 
  FaUsersCog 
} from "react-icons/fa";

export default function Sidebar() {
  const router = useRouter();

  return (
    <div className="w-64 h-screen bg-black text-white flex flex-col py-6 px-4">

      {/* User Info On Top */}
      <div className="flex items-center space-x-3 mb-10">
        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-xl">
          SC
        </div>
        <div>
          <p className="font-semibold">Scheduler</p>
          <p className="text-sm text-gray-400">scheduler@example.com</p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col space-y-4">

        {/* Profile */}
        <button
          onClick={() => router.push("/scheduler/profile")}
          className="flex items-center space-x-3 hover:bg-gray-800 py-2 px-3 rounded-md"
        >
          <FaUser />
          <span>Profile</span>
        </button>

        {/* Dashboard */}
        <button
          onClick={() => router.push("/scheduler/dashboard")}
          className="flex items-center space-x-3 hover:bg-gray-800 py-2 px-3 rounded-md"
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </button>

        {/* Schedule Flight */}
        <button
          onClick={() => router.push("/scheduler/schedule")}
          className="flex items-center space-x-3 hover:bg-gray-800 py-2 px-3 rounded-md"
        >
          <FaPlaneDeparture />
          <span>Schedule Flight</span>
        </button>

        {/* Assign Crew */}
        <button
          onClick={() => router.push("/scheduler/assign_crew")}
          className="flex items-center space-x-3 hover:bg-gray-800 py-2 px-3 rounded-md"
        >
          <FaUsersCog />
          <span>Assign Crew</span>
        </button>

      </nav>
    </div>
  );
}
