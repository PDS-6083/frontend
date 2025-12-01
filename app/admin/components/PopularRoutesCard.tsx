"use client";

import { useEffect, useState } from "react";

interface PopularRoute {
  route_id: number;
  source_airport_code: string;
  destination_airport_code: string;
  approved_capacity: number;
}

export default function PopularRoutesCard() {
  const [routes, setRoutes] = useState<PopularRoute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch dashboard");
          return;
        }

        const data = await res.json();
        setRoutes(data.most_popular_routes);
      } catch (err) {
        console.error("Error fetching routes:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="text-black">Loading routes...</div>;
  }

  return (
    <div className="border bg-white p-4 rounded-md shadow-sm w-72 text-black">
      {routes.map((r, idx) => (
        <div key={idx} className="flex justify-between text-sm py-1">
          <span>
            {r.source_airport_code} → {r.destination_airport_code}
          </span>
          <span className="text-gray-700">
            capacity {r.approved_capacity}
          </span>
        </div>
      ))}

      <p className="text-center text-xs mt-3 text-gray-600">
        Most Popular Routes
      </p>
    </div>
  );
}
