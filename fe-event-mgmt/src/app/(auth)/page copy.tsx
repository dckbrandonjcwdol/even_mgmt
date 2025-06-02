'use client'; 

import React from "react";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";


export default async function EventPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <img
            src="https://images.unsplash.com/photo-1608137680929-5e1a0a9eb618"
            alt="stage"
            className="rounded-xl w-full h-64 object-cover"
          />
          <h2 className="text-3xl font-bold mt-6">Comedy #1</h2>
          <p className="text-gray-700 mt-2">
            Get ready to laugh your socks off with Comedy #1, where top comedians
            will have you in stitches all night long!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-white p-4 rounded border">
              <p className="font-semibold">Date and time</p>
              <p className="text-sm text-gray-600">
                Saturday, July 12 - 12 - 2am WIB
              </p>
            </div>
            <div className="bg-white p-4 rounded border">
              <p className="font-semibold">Location</p>
              <p className="text-sm text-gray-600">Online event</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
