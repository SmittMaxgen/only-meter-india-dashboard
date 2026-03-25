import React, { useEffect, useState } from 'react';
import StatCard from '../Components/StateCard';
import BookingChart from '../Components/BookingChart';
import UserChart from '../Components/UserChart';
import RecentBookings from '../Components/RecentBooking';
import RecentUsers from '../Components/RecentUser';
import { useAppContext } from "../Central_Store/app_context.jsx";
import { FaUsers, FaDollarSign,FaCar } from 'react-icons/fa';
 
const Home = () => {
  const { fetchedData,getServicesData } = useAppContext();
  let [lenght,setLength] = useState({
    user:0,
    driver:0,
    vehicle:0,
    subscription:0
  })
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
      subscription: fetchedData?.subscriptions?.length || 0
    });
  }
}, [fetchedData]);
  return (
    <div className=" bg-gray-100 min-h-screen " >
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
     
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          icon={<FaUsers size={24} className="text-blue-500" />}
          title="Users"
          value={lenght.user}
          color="bg-blue-100"
        />
        <StatCard
          icon={<FaUsers size={24} className="text-green-500" />}
          title="Drivers"
          value={lenght.driver}
          color="bg-green-100"
        />
        <StatCard
          icon={<FaCar size={24} className="text-yellow-500" />}
          title="Vehicles"
          value={lenght.vehicle}
          color="bg-yellow-100"
        />
        <StatCard
          icon={<FaDollarSign size={24} className="text-red-500" />}
          title="Subsciptions Plans"
          value={lenght.subscription}
          color="bg-red-100"
        />
      </div>
 
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        <div className="lg:col-span-3">
          <BookingChart />
        </div>
        <div className="lg:col-span-2">
          <UserChart />
        </div>
      </div>
     
      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3">
       
        <RecentBookings />
        </div>
          <div className="lg:col-span-2">
        <RecentUsers />
        </div>
        </div>
    </div>
  );
};
 
export default Home;