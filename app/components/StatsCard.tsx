"use client";

export default function StatsCard({
  value,
  label,
  width = "w-40"
}: {
  value: string | number;
  label: string;
  width?: string;
}) {
  return (
    <div
      className={`bg-white border-2 border-black shadow-sm rounded-md p-6 text-center ${width}`}
    >
      <p className="text-3xl font-bold text-black">{value}</p>
      <p className="text-gray-600 text-sm mt-1">{label}</p>
    </div>
  );
}
