export default function PopularRoutesCard() {
  const routes = [
    { from: "JFK", to: "IAD", cap: 8900 },
    { from: "IAD", to: "DFW", cap: 7500 },
    { from: "JFK", to: "LAX", cap: 7300 },
    { from: "LAX", to: "DFW", cap: 5200 },
    { from: "DXB", to: "IAD", cap: 3100 },
    { from: "ORD", to: "JFK", cap: 1000 },
    { from: "JFK", to: "IAD", cap: 995 },
  ];

  return (
    <div className="border bg-white p-4 rounded-md shadow-sm w-72 text-black">
      {routes.map((r, idx) => (
        <div key={idx} className="flex justify-between text-sm py-1">
          <span>{r.from} → {r.to}</span>
          <span className="text-gray-700">capacity {r.cap}</span>
        </div>
      ))}

      <p className="text-center text-xs mt-3 text-gray-600">
        Most Popular Routes
      </p>
    </div>
  );
}
//static data for popular routes card