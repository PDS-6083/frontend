"use client";

export default function ProfileCard({
  name,
  phone,
  role,
  email,
  employeeId
}: {
  name: string;
  phone: string;
  role: string;
  email: string;
  employeeId: string;
}) {
  return (
    <div className="bg-white border shadow-md rounded-xl p-8 w-96 text-black">
      <p className="mb-4">
        <span className="font-semibold">Name:</span> {name}
      </p>

      <p className="mb-4">
        <span className="font-semibold">Phone:</span> {phone}
      </p>

      <p className="mb-4">
        <span className="font-semibold">Role:</span> {role}
      </p>

      <p className="mb-4">
        <span className="font-semibold">Email:</span> {email}
      </p>

      <p>
        <span className="font-semibold">Employee ID:</span> {employeeId}
      </p>
    </div>
  );
}
