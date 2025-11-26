export default function ProfileCard() {
  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm w-80 text-black">
      <div className="space-y-3">
        <p>
          <span className="font-semibold text-black">Name:</span>{" "}
          <span className="text-gray-700">John Doe</span>
        </p>
        <p>
          <span className="font-semibold text-black">Phone:</span>{" "}
          <span className="text-gray-700">+1 324 234-3456</span>
        </p>
        <p>
          <span className="font-semibold text-black">Role:</span>{" "}
          <span className="text-gray-700">Admin</span>
        </p>
        <p>
          <span className="font-semibold text-black">Email:</span>{" "}
          <span className="text-gray-700">johndoe@gmail.com</span>
        </p>
      </div>
    </div>
  );
}


//const user = await getUser();
//<p>{user.name}</p>

//backend integration purpose example
