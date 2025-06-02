"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const destinations = [
  {
    name: "New York",
    image: "https://source.unsplash.com/600x400/?newyork",
  },
  {
    name: "Los Angeles",
    image: "https://source.unsplash.com/600x400/?losangeles",
  },
  {
    name: "Chicago",
    image: "https://source.unsplash.com/600x400/?chicago",
  },
  {
    name: "Washington",
    image: "https://source.unsplash.com/600x400/?washington",
  },
  {
    name: "Miami",
    image: "https://source.unsplash.com/600x400/?miami",
  },
];


const TopDestinations = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full bg-gray-50 py-10 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Top destinations in <span className="text-purple-700">United States</span>
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll(-300)}
              className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll(300)}
              className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar pb-2 pr-6"
          >
            {destinations.map((item, index) => (
              <div
                key={index}
                className="min-w-[200px] sm:min-w-[240px] md:min-w-[280px] flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow hover:shadow-md transition"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                    <p className="text-white font-semibold text-lg">{item.name}</p>
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500" />
              </div>
            ))}
          </div>

          {/* Gradient fade on the right */}
          <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default TopDestinations;
