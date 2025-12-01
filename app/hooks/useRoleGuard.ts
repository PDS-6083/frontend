"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useUser from "./useUser";

export default function useRoleGuard(allowedRoles: string[]) {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!allowedRoles.includes(user.user_type)) {
      router.replace("/403");
    }
  }, [loading, user]);
}
