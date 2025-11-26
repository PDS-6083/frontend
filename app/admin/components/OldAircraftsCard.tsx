export default function OldAircraftsCard() {
  const aircrafts = [
    { reg: "N54320", type: "A321", age: "15YR" },
    { reg: "N23110", type: "A319", age: "13YR" },
    { reg: "N51222", type: "B737", age: "11YR" },
    { reg: "N51221", type: "A321", age: "9YR" },
    { reg: "N11002", type: "B777", age: "8YR" },
    { reg: "N12091", type: "A787", age: "7YR" },
    { reg: "N54120", type: "A321", age: "6YR" },
  ];

  return (
    <div className="border bg-white p-4 rounded-md shadow-sm w-72 text-black">
      {aircrafts.map((a, idx) => (
        <div key={idx} className="flex justify-between text-sm py-1">
          <span>{a.reg}</span>
          <span>{a.type}</span>
          <span className="text-gray-700">{a.age}</span>
        </div>
      ))}

      <p className="text-center text-xs mt-3 text-gray-600">
        Oldest Aircrafts
      </p>
    </div>
  );
}
