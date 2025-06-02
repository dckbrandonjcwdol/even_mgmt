"use client";

import Image from "next/image";
import React from "react";

const tabs = [
  "All",
  "For you",
  "Online",
  "Today",
  "This weekend",
  "Juneteenth",
  "Pride",
  "Free",
  "Music",
  "Food & Drink",
  "Charity & Causes",
];

const events = [
  {
    title: "Certified International Procurement Professional...",
    date: "Mon, Jul 21 • 8:30 AM",
    location: "Online Training",
    price: "From $1,602.45",
    image: "https://picsum.photos/seed/event1/400/200",
    organizer: "PT. Husin Intelligence Group",
    followers: "164 followers",
    badge: null,
  },
  {
    title: "WEBINAR RAHASIA PIPA DUIT 24/7",
    date: "Sat, Jun 14 • 2:00 PM",
    location: "Hotel Grand Tjokro",
    price: "Free",
    image: "https://picsum.photos/seed/event4/400/200",
    organizer: "Kwet Liung",
    followers: "1.5k followers",
    badge: "Going fast",
  },
  {
    title: "Indonesia International Industry Week",
    date: "Wednesday • 10:00 AM",
    location: "JIEXPO Kemayoran",
    price: "Free",
    image: "https://picsum.photos/seed/industry-week/400/200",
    organizer: "Meorient Exhibition International",
    followers: "11 followers",
    badge: "Sales end soon",
  },
];

const EventSection = () => {
  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-12">
      {/* Tabs */}
      <div className="flex flex-nowrap gap-4 text-sm font-medium border-b pb-2 overflow-x-auto -mx-4 px-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-3 pb-1 border-b-2 whitespace-nowrap ${
              tab === "For you"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>


      {/* Title */}
      <h2 className="text-xl font-bold mt-6 mb-4 flex items-center gap-2">
        <span className="text-2xl">🏛️</span> Our top picks for you
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <div
            key={index}
            className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
          >
            <div className="relative">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="w-full h-[160px] object-cover"
              />
              {event.badge && (
                <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded">
                  {event.badge}
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold leading-snug mb-1 line-clamp-2">
                {event.title}
              </h3>
              <p className="text-xs text-gray-600 mb-1">{event.date}</p>
              <p className="text-xs text-gray-600 mb-1">{event.location}</p>
              <p className="text-xs text-gray-900 font-medium mb-2">
                {event.price}
              </p>
              <p className="text-xs text-gray-600">
                {event.organizer}
                <br />
                <span className="text-gray-500">{event.followers}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventSection;
