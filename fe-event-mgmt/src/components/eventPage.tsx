import React from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function EventPage() {
  return (
    // <div className="min-h-screen bg-white flex">
    <div className="min-h-screen w-full bg-white flex flex-col md:flex-row">
      {/* Sidebar */}
      {/* <div className="w-64 bg-gray-100 p-4 border-r"> */}
      <aside className="w-full md:w-1/4 bg-gray-100 p-4">
        <div className="text-red-500 text-xl font-bold mb-6">eventbrite</div>

        <button className="text-blue-600 mb-4">&larr; Back to events</button>

        <div className="mb-6">
          <div className="font-semibold text-lg">Comedy #1</div>
          <div className="text-sm text-gray-600 flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" /> Fri, Jul 11, 2025, 10:00 AM
          </div>
          <div className="mt-2">
            <span className="text-xs bg-gray-200 px-2 py-1 rounded">Draft</span>
            <a href="#" className="ml-2 text-sm text-blue-600 underline">
              Preview
            </a>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="p-2 rounded bg-blue-100 text-blue-800 font-semibold">
            Build event page
            <div className="text-xs font-normal text-gray-500">
              Add all of your event details and let attendees know what to expect
            </div>
          </div>
          <div className="p-2 rounded hover:bg-gray-200">Online event page</div>
          <div className="p-2 rounded bg-blue-50 text-blue-700 font-semibold">Add tickets</div>
          <div className="p-2 rounded hover:bg-gray-200">Publish</div>
        </div>

        <div className="mt-6 text-sm text-gray-600 space-y-2">
          <div>Dashboard</div>
          <div>Order Options</div>
          <div>Payments & tax</div>
        </div>
      </aside>

      {/* Main content */}
      {/* <div className="flex-1 p-8"> */}
      <div className="w-full md:w-3/4 p-4">
        <div className="flex justify-between items-center mb-4">
          <div></div>
          <div className="flex items-center gap-4">
            <button className="text-sm text-gray-600">Preview Your Event</button>
            <button className="text-sm font-semibold">Publish</button>
            <div className="w-8 h-8 bg-blue-600 rounded-full text-white flex items-center justify-center text-sm font-semibold">
              DK
            </div>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-2 mb-4 max-w-4xl">
          <Image
            src="/your-image-url.png"
            alt="Event"
            className="rounded-lg object-cover h-48 w-full"
          />
        </div>

        <div className="max-w-4xl">
          <div className="text-3xl font-bold mb-1">Comedy #1</div>
          <div className="text-gray-600 mb-4">
            Get ready to laugh your socks off with Comedy #1, where top comedians will have you in stitches all night long!
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="font-semibold mb-1">Date and time</div>
              <div className="flex items-center text-gray-700">
                <CalendarIcon className="w-5 h-5 mr-1" /> Saturday, July 12 • 12 - 2am WIB
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="font-semibold mb-1">Location</div>
              <div className="text-gray-700">Online event</div>
            </div>
          </div>
        </div>
      </div>
    </div> 
  );
}
