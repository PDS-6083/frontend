"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/me`, {
          credentials: "include",
        });

        // NOT logged in → go to login
        if (!res.ok) {
          router.replace("/login");
          return;
        }

        const user = await res.json();

        // Redirect based on user_type
        switch (user.user_type) {
          case "ADMIN":
            router.replace("/admin/dashboard");
            break;
          case "ENGINEER":
            router.replace("/engineer/dashboard");
            break;
          case "CREW":
            router.replace("/crew/dashboard");
            break;
          case "SCHEDULER":
            router.replace("/scheduler/dashboard");
            break;
          default:
            router.replace("/login");
        }
      } catch (e) {
        console.error(e);
        router.replace("/login");
      }
    }

    checkAuth();
  }, [router]);

  return <p className="text-white">Redirecting…</p>;
}