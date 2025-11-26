interface Props {
  count: number;
  label: string;
}

export default function FlightsStatCard({ count, label }: Props) {
  return (
    <div className="border bg-white px-10 py-6 rounded-md shadow-sm text-center">
      <p className="text-4xl font-bold text-black">{count}</p>
      <p className="text-xs text-gray-600 mt-2">{label}</p>
    </div>
  );
}
//simple stat card for flights on admin dashboard