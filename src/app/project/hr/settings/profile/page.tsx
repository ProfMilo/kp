"use client";

import React from 'react';
import Sidebar from '@/app/components/Sidebar';

const ProfileSettingsPage = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-[1920px] mx-auto">
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex items-center justify-between">
            <div className="flex items-center justify-center sm:justify-start">
              <img
                src="/logo.jpeg"
                alt="Ansinda Logo"
                className="h-16 w-auto"
              />
            </div>
            <div className="flex-1 flex justify-center items-center">
              <h2 className="text-3xl font-bold text-black text-center">Profile Settings</h2>
            </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-600 mb-4">Profile</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">NIK</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="email" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Division</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Position</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">City</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Bank</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">No. Bank</label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" />
              </div>
            </div>
            <div className="mt-6 flex space-x-4">
              <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">Save Changes</button>
              <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800">Reset Password</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;