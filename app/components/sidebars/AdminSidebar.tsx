"use client";

import { useRouter } from "next/navigation";
import LogoutButton from "./LogoutButton";
import { FaUser, FaRoute, FaPlane, FaTachometerAlt } from "react-icons/fa";

export default function AdminSidebar() {
  const router = useRouter();

  return (
    <div className="w-64 h-screen bg-black text-white flex flex-col py-6 px-4">

      {/* USER INFO */}
      <div className="flex items-center space-x-3 mb-10">
        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-xl">
          JD
        </div>
        <div>
          <p className="font-semibold">John Doe</p>
          <p className="text-sm text-gray-400">johndoe@gmail.com</p>
        </div>
      </div>

      {/* NAV */}
            <nav className="flex flex-col space-y-4">
        {/* Dashboard */}
        <button
          onClick={() => router.push("/admin")}
          className="flex items-center space-x-3 hover:bg-gray-800 py-2 px-3 rounded-md"
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </button>

        {/* Create Route */}
        <button
          onClick={() => router.push("/admin/routes")}
          className="flex items-center space-x-3 hover:bg-gray-800 py-2 px-3 rounded-md"
        >
          <FaRoute />
          <span>Create Route</span>
        </button>

        {/* Add Aircraft */}
        <button
          onClick={() => router.push("/admin/aircrafts")}
          className="flex items-center space-x-3 hover:bg-gray-800 py-2 px-3 rounded-md"
        >
          <FaPlane />
          <span>Add Aircraft</span>
        </button>

        {/* Logout */}
        <LogoutButton />
      </nav>
    </div>
  );
}