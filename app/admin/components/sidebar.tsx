"use client";

import { useRouter } from "next/navigation";
import { FaUser, FaRoute, FaPlane, FaTachometerAlt } from "react-icons/fa";

export default function Sidebar() {
  const router = useRouter();

  return (
    <div className="w-64 h-screen bg-black text-white flex flex-col py-6 px-4">
      {/* User Info On Top */}
      <div className="flex items-center space-x-3 mb-10">
        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-xl">
          JD
        </div>
        <div>
          <p className="font-semibold">John Doe</p>
          <p className="text-sm text-gray-400">johndoe@gmail.com</p>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col space-y-4">

        <button
            onClick={() => router.push("/admin/profile")}
            className="flex items-center space-x-3 hover:bg-gray-800 py-2 px-3 rounded-md"
        >
        <FaUser />
        <span>Profile</span>
        </button>
       <button
            onClick={() => router.push("/admin/dashboard")}
                className="flex items-center space-x-3 hover:bg-gray-800 py-2 px-3 rounded-md">
            <FaTachometerAlt />
            <span>Dashboard</span>
        </button>


        <button
          onClick={() => router.push("/admin/route")}
          className="flex items-center space-x-3 hover:bg-gray-800 py-2 px-3 rounded-md"
        >
          <FaRoute />
          <span>Create Route</span>
        </button>

        <button
          onClick={() => router.push("/admin/add-aircraft")}
          className="flex items-center space-x-3 hover:bg-gray-800 py-2 px-3 rounded-md"
        >
          <FaPlane />
          <span>Add Aircraft</span>
        </button>
      </nav>
    </div>
  );
}
