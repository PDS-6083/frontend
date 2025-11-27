"use client";

import AdminSidebar from "@/app/components/sidebars/AdminSidebar";
import ProfileCard from "@/app/components/ProfileCard";
import { FaUserCircle } from "react-icons/fa";

export default function AdminProfilePage() {
  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-10">
        
        <h1 className="text-3xl font-bold text-black mb-10">My Profile</h1>

        <div className="flex space-x-10">
          
          {/* Large User Icon */}
          <FaUserCircle className="text-purple-600" size={120} />

          {/* Shared Profile Card */}
          <ProfileCard
            name="John Doe"
            phone="+1 324 234-3456"
            role="Admin"
            email="admin@aero.com"
            employeeId="ADM-2025-001"
          />

        </div>
      </div>
    </div>
  );
}

/*
const user = await fetch("/api/auth/me", { credentials: "include" }).then(r => r.json());

<ProfileCard
  name={user.name}
  phone={user.phone}
  role={user.user_type}
  email={user.email}
  employeeId={user.employee_id}
/>
*/