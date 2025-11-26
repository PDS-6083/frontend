"use client";

import Sidebar from "../components/sidebar";
import ProfileCard from "../components/ProfileCard";
import { FaUserCircle } from "react-icons/fa";

export default function AdminPage() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 bg-gray-100 p-10">
        <h1 className="text-3xl font-semibold mb-6 text-black">
            My Profile
        </h1>
        <div className="flex space-x-10">
          {/* User Icon */}
          <FaUserCircle className="text-purple-600" size={120} />

          {/* Profile Information */}
          <ProfileCard />
        </div>
      </div>
    </div>
  );
}
