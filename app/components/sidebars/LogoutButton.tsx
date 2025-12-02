"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Backend route: POST /api/logout
const LOGOUT_PATH = "/api/logout";

// Where to send user after logout
const LOGIN_PATH = "/login";

type LogoutButtonProps = {
  className?: string;
};

export default function LogoutButton({ className = "" }: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await fetch(`${API_BASE_URL}${LOGOUT_PATH}`, {
        method: "POST",
        credentials: "include", // send auth cookie
      }).catch((err) => {
        // even if this fails, we still redirect
        console.error("Logout error:", err);
      });
    } finally {
      setLoading(false);
      router.push(LOGIN_PATH);
      router.refresh();
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`flex items-center gap-2 rounded-md border border-red-500 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-600 hover:text-white transition ${className}`}
    >
      <span className="text-base">⏏</span>
      <span>{loading ? "Logging out..." : "Logout"}</span>
    </button>
  );
}