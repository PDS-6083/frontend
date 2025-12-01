"use client";

import { useEffect, useState } from "react";

export default function useUser() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
          credentials: "include",
        });
        if (res.ok) {
          setUser(await res.json());
        }
      } catch (err) {
        console.error("User load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { user, loading };
}
