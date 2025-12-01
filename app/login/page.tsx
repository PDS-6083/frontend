"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: "POST",
        credentials: "include", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_type: role,
          email,
          password,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.detail || "Login failed");
        return;
      }

      const data = await res.json();
      const userType = data.user.user_type;

      // Redirect according to backend user_type
      if (userType === "admin") router.push("/admin/profile");
      if (userType === "scheduler") router.push("/scheduler/profile");
      if (userType === "engineer") router.push("/engineer");
      if (userType === "crew") router.push("/crew");

    } catch (error) {
      console.error("Login Error:", error);
      alert("Network error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111] px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg">

        <h1 className="text-2xl font-semibold text-black">Welcome to AeroSync</h1>
        <p className="text-gray-600 text-sm mb-6">
          Please login with your employee email and password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md 
                         outline-none focus:ring-2 focus:ring-black text-black"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="crew">Crew</option>
              <option value="scheduler">Scheduler</option>
              <option value="engineer">Engineer</option>
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md 
                         outline-none focus:ring-2 focus:ring-black
                         text-black"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md 
                         outline-none focus:ring-2 focus:ring-black
                         text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md font-medium hover:bg-gray-800 transition"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
