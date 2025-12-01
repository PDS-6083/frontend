interface Props {
  routes: {
    source_airport_code: string;
    destination_airport_code: string;
    approved_capacity: number;
  }[];
}

export default function PopularRoutesCard({ routes }: Props) {
  return (
    <div className="border bg-white p-4 rounded-md shadow-sm w-72 text-black">
      {routes.length === 0 && (
        <p className="text-center text-gray-600 text-sm">No routes found</p>
      )}

      {routes.map((r, idx) => (
        <div key={idx} className="flex justify-between text-sm py-1">
          <span>
            {r.source_airport_code} → {r.destination_airport_code}
          </span>
          <span className="text-gray-700">capacity {r.approved_capacity}</span>
        </div>
      ))}

      <p className="text-center text-xs mt-3 text-gray-600">
        Most Popular Routes
      </p>
    </div>
  );
}
