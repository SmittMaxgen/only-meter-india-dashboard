import React from 'react';
 
const users = [
  { name: 'eadeem holding', time: '8:47 AM | 08 October 2025', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
  { name: 'Sumit Kumar Das', time: '3:38 PM | 07 October 2025', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
  { name: 'Alex Johnson', time: '1:05 PM | 07 October 2025', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
  { name: 'Sumit Kumar Das', time: '3:38 PM | 07 October 2025', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
  { name: 'Alex Johnson', time: '1:05 PM | 07 October 2025', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
];
 
const RecentUsers = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Recent Users</h2>
        <a href="/dashboard/customers" className="text-sm text-blue-black font-semibold hover:underline">View all</a>
      </div>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.name} className="flex items-center hover:bg-gray-200 py-2">
            <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full mr-4" />
            <div>
              <p className="font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
 
export default RecentUsers;    