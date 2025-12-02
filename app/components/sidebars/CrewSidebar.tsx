"use client";

import { useRouter } from "next/navigation";
import LogoutButton from "./LogoutButton";
import { FaUser, FaPlane } from "react-icons/fa";

export default function CrewSidebar() {
  const router = useRouter();

  return (
    <div className="w-64 h-screen bg-black text-white flex flex-col py-6 px-4">
      {/* Static header for now – later you can replace with real user data */}
      <div className="flex items-center mb-10 gap-3">
        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-xl">
          JD
        </div>
        <div>
          <p className="font-semibold">John Doe</p>
          <p className="text-sm text-gray-400">johndoe@gmail.com</p>
        </div>
      </div>

      <nav className="flex flex-col space-y-4">
        {/* Default page – Dashboard (/crew) */}
        <button
          onClick={() => router.push("/crew")}
          className="flex items-center gap-3 hover:bg-gray-800 py-2 px-3 rounded-md w-full text-left"
        >
          <FaPlane />
          <span>Dashboard</span>
        </button>

        {/* My Profile -> /crew/profile */}
        <button
          onClick={() => router.push("/crew/profile")}
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

        {/* Logout button */}
        <LogoutButton />
      </nav>
    </div>
  );
}