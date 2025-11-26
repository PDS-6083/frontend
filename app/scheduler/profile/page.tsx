"use client";

import SchedulerSidebar from "../components/sidebar";
import { FaUserCircle } from "react-icons/fa";

export default function SchedulerProfile() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SchedulerSidebar />

      {/* Main content */}
      <div className="flex-1 bg-gray-100 p-10">
        <h1 className="text-3xl font-semibold mb-6 text-black">
          My Profile
        </h1>

        <div className="flex space-x-10">
          {/* User Icon */}
          <FaUserCircle className="text-purple-600" size={120} />

          {/* Profile Information */}
          <div className="bg-white shadow-md border rounded-xl p-8 w-96 text-black">
            <p className="mb-4">
              <span className="font-semibold">Name:</span> John Doe
            </p>

            <p className="mb-4">
              <span className="font-semibold">Phone:</span> +1 324 234-3456
            </p>

            <p className="mb-4">
              <span className="font-semibold">Role:</span> Scheduler
            </p>

            <p className="mb-4">
              <span className="font-semibold">Email:</span> scheduler@aero.com
            </p>

            <p>
              <span className="font-semibold">Employee ID:</span> SCH-2025-001
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
