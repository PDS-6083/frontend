"use client";

import SchedulerSidebar from "../components/sidebar";

export default function SchedulerDashboard() {
  return (
    <div className="flex min-h-screen">
      <SchedulerSidebar />

      <div className="flex-1 bg-gray-100 p-10">
        <h1 className="text-3xl font-bold text-black mb-10">Dashboard</h1>

        {/* Main dashboard content: flights list + stats */}
        <div className="flex space-x-10">
          {/* Recently Scheduled Flights */}
          <div className="bg-white border-2 border-black shadow-sm rounded-md p-5 w-80">
            <ul className="space-y-3 text-black">
              <li className="flex justify-between">
                <span>JFK → IAD</span>
                <span className="text-gray-500">capacity 8900</span>
              </li>
              <li className="flex justify-between">
                <span>IAD → DFW</span>
                <span className="text-gray-500">capacity 7500</span>
              </li>
              <li className="flex justify-between">
                <span>JFK → LAX</span>
                <span className="text-gray-500">capacity 7300</span>
              </li>
              <li className="flex justify-between">
                <span>LAX → DFW</span>
                <span className="text-gray-500">capacity 5200</span>
              </li>
              <li className="flex justify-between">
                <span>DXB → IAD</span>
                <span className="text-gray-500">capacity 3100</span>
              </li>
              <li className="flex justify-between">
                <span>ORD → JFK</span>
                <span className="text-gray-500">capacity 1000</span>
              </li>
              <li className="flex justify-between">
                <span>JFK → IAD</span>
                <span className="text-gray-500">capacity 995</span>
              </li>
            </ul>

            <p className="text-center text-gray-500 text-sm mt-3">
              Recently Scheduled Flights
            </p>
          </div>

          {/* STATS SECTION */}
          <div className="flex flex-col space-y-8">
            {/* Row 1 */}
            <div className="flex gap-6">
              <div className="bg-white border-2 border-black shadow-sm rounded-md p-6 text-center w-40">
                <p className="text-3xl font-bold text-black">23</p>
                <p className="text-gray-600 text-sm mt-1">Flights in Air</p>
              </div>

              <div className="bg-white border-2 border-black shadow-sm rounded-md p-6 text-center w-40">
                <p className="text-3xl font-bold text-black">100</p>
                <p className="text-gray-600 text-sm mt-1">Weekly Flts</p>
              </div>

              <div className="bg-white border-2 border-black shadow-sm rounded-md p-6 text-center w-40">
                <p className="text-3xl font-bold text-black">61%</p>
                <p className="text-gray-600 text-sm mt-1">Util. Rate</p>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex gap-6">
              <div className="bg-white border-2 border-black shadow-sm rounded-md p-6 text-center w-40">
                <p className="text-3xl font-bold text-black">3</p>
                <p className="text-gray-600 text-sm mt-1">Aircrafts On-ground</p>
              </div>

              <div className="bg-white border-2 border-black shadow-sm rounded-md p-6 text-center w-40">
                <p className="text-3xl font-bold text-black">1</p>
                <p className="text-gray-600 text-sm mt-1">Maint Crafts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
//scheduler dashboard with static data and sidebar