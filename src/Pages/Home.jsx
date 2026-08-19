import React, { useEffect, useState } from "react";
import StatCard from "../Components/StateCard";
import BookingChart from "../Components/BookingChart";
import UserChart from "../Components/UserChart";
import RecentBookings from "../Components/RecentBooking";
import RecentUsers from "../Components/RecentUser";
import { useAppContext } from "../Central_Store/app_context.jsx";
import { FaUsers, FaDollarSign, FaCar } from "react-icons/fa";

const Home = () => {
  const { fetchedData, getServicesData } = useAppContext();
  let [lenght, setLength] = useState({
    user: 0,
    driver: 0,
    vehicle: 0,
    subscription: 0,
  });

  useEffect(() => {
    getServicesData();
  }, []); // <-- IMPORTANT

  // 2️⃣ Run only when fetchedData updates
  useEffect(() => {
    if (fetchedData) {
      console.log(fetchedData);

      setLength({
        user: fetchedData?.users?.length || 0,
        driver: fetchedData?.drivers?.length || 0,
        vehicle: fetchedData?.vehicle?.length || 0,
        subscription: fetchedData?.subscriptions?.length || 0,
      });
    }
  }, [fetchedData]);

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="h-full">
            <StatCard
              icon={<FaUsers size={24} className="text-blue-500" />}
              title="Users"
              value={lenght.user}
              color="bg-blue-100"
            />
          </div>
          <div className="h-full">
            <StatCard
              icon={<FaUsers size={24} className="text-green-500" />}
              title="Drivers"
              value={lenght.driver}
              color="bg-green-100"
            />
          </div>
          <div className="h-full">
            <StatCard
              icon={<FaCar size={24} className="text-yellow-500" />}
              title="Vehicles"
              value={lenght.vehicle}
              color="bg-yellow-100"
            />
          </div>
          <div className="h-full">
            <StatCard
              icon={<FaDollarSign size={24} className="text-red-500" />}
              title="Subsciptions Plans"
              value={lenght.subscription}
              color="bg-red-100"
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6 mb-6 md:mb-8 items-stretch">
          <div className="lg:col-span-3 flex">
            <div className="w-full h-[380px] md:h-[420px]">
              <BookingChart />
            </div>
          </div>
          <div className="lg:col-span-2 flex">
            <div className="w-full h-[380px] md:h-[420px]">
              <UserChart />
            </div>
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6 items-stretch">
          <div className="lg:col-span-3 flex">
            <div className="w-full h-full min-h-[480px]">
              <RecentBookings />
            </div>
          </div>
          <div className="lg:col-span-2 flex">
            <div className="w-full h-full min-h-[480px]">
              <RecentUsers />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
