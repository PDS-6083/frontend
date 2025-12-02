"use client";

import { useRouter } from "next/navigation";
import LogoutButton from "./LogoutButton";
import { FaUser, FaTools, FaClipboardList, FaFileAlt } from "react-icons/fa";

export default function EngineerSidebar() {
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
        {/* Default page – profile */}
        <button
          onClick={() => router.push("/engineer")}
          className="flex items-center space-x-3 hover:bg-gray-800 py-2 px-3 rounded-md w-full text-left"
        >
          <FaUser />
          <span>Profile</span>
        </button>

        {/* Maintenance jobs dashboard */}
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