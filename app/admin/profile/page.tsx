// "use client";

// import { useEffect, useState } from "react";
// import AdminSidebar from "@/app/components/sidebars/AdminSidebar";

// import ProfileCard from "@/app/components/ProfileCard";
// import { FaUserCircle } from "react-icons/fa";

// export default function AdminProfilePage() {
//   const [user, setUser] = useState<{
//     name: string;
//     phone?: string;
//     email: string;
//     user_type: string;
//     employeeId?: string;
//   } | null>(null);

//   // Fetch current user
//   useEffect(() => {
//     async function loadUser() {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
//           { credentials: "include" }
//         );

//         if (res.ok) {
//           const data = await res.json();
//           setUser({
//             name: data.name,
//             email: data.email,
//             user_type: data.user_type,
//             phone: data.phone ?? "N/A",
//             employeeId: data.id,
//           });
//         }
//       } catch (err) {
//         console.error("Failed to load profile:", err);
//       }
//     }

//     loadUser();
//   }, []);

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <AdminSidebar />

//       {/* Main content */}
//       <div className="flex-1 bg-gray-100 p-10">
//         <h1 className="text-3xl font-semibold mb-6 text-black">My Profile</h1>

//         <div className="flex space-x-10">
//           {/* User Icon */}
//           <FaUserCircle className="text-purple-600" size={120} />

//           {/* Shared Profile Card */}
//           <ProfileCard
//             name={user?.name ?? "Loading..."}
//             phone={user?.phone ?? "Loading..."}
//             role={user?.user_type ?? "Loading..."}
//             email={user?.email ?? "Loading..."}
//             employeeId={user?.employeeId ?? "Loading..."}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/app/components/sidebars/AdminSidebar";
import ProfileCard from "@/app/components/ProfileCard";
import { FaUserCircle } from "react-icons/fa";

interface UserResponse {
  id: string;
  name: string;
  email: string;
  user_type: string;
  phone?: string;
}

export default function AdminProfilePage() {
  const [user, setUser] = useState<UserResponse | null>(null);

  // Load user info from backend
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          console.error("Could not fetch profile");
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    }

    loadUser();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main */}
      <div className="flex-1 bg-gray-100 p-10">
        <h1 className="text-3xl font-semibold mb-6 text-black">
          My Profile
        </h1>

        <div className="flex space-x-10">
          {/* Icon */}
          <FaUserCircle className="text-purple-600" size={120} />

          {/* Profile Card */}
          <ProfileCard
            name={user?.name ?? "Loading..."}
            phone={user?.phone ?? "N/A"}
            role={user?.user_type ?? "Loading..."}
            email={user?.email ?? "Loading..."}
            employeeId={user?.id ?? "Loading..."}
          />
        </div>
      </div>
    </div>
  );
}
