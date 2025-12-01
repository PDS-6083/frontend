"use client";

import { useEffect, useState } from "react";

interface Aircraft {
  registration_number: string;
  aircraft_company: string;
  model: string;
  capacity: number;
  status: string;
}

export default function OldAircraftsCard() {
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAircrafts() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/aircraft`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch aircrafts");
          return;
        }

        const data = await res.json();
        setAircrafts(data);
      } catch (err) {
        console.error("Error fetching aircrafts:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAircrafts();
  }, []);

  if (loading) {
    return <div className="text-black">Loading aircrafts...</div>;
  }

  return (
    <div className="border bg-white p-4 rounded-md shadow-sm w-72 text-black">
      {aircrafts.map((a, idx) => (
        <div key={idx} className="flex justify-between text-sm py-1">
          <span>{a.registration_number}</span>
          <span>{a.model}</span>
          <span className="text-gray-700">{a.status}</span>
        </div>
      ))}

      <p className="text-center text-xs mt-3 text-gray-600">
        Aircraft List
      </p>
    </div>
  );
}
