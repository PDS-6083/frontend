"use client";

import SchedulerSidebar from "@/app/components/sidebars/SchedulerSidebar";
import ProfileCard from "@/app/components/ProfileCard";
import { FaUserCircle } from "react-icons/fa";

export default function SchedulerProfile() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SchedulerSidebar />

      {/* Main content */}
      <div className="flex-1 bg-gray-100 p-10">
        <h1 className="text-3xl font-semibold mb-6 text-black">My Profile</h1>

        <div className="flex space-x-10">
          {/* User Icon */}
          <FaUserCircle className="text-purple-600" size={120} />

          {/* Shared Profile Card */}
          <ProfileCard
            name="John Doe"
            phone="+1 324 234-3456"
            role="Scheduler"
            email="scheduler@aero.com"
            employeeId="SCH-2025-001"
          />
        </div>
      </div>
    </div>
  );
}
