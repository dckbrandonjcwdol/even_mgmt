"use client";

import Link from "next/link";
import Wrapper from "./wrapper";
import Image from "next/image";
import Logout from "./logout";
import { getBrandName } from "@/lib/brand";
import { useState } from 'react';
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'About Us', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Teams', path: '/teams' },
  ];

  return (
    <div className="sticky top-0 z-10 bg-white shadow-sm">
      <Wrapper>
        <div className="h-[60px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              alt="Eventique Logo"
              src="/logo4.png"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
              priority
            />
            <span className="text-2xl font-semibold whitespace-nowrap">
              {getBrandName()}
            </span>
          </Link>


            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.path}
                  className=" hover:text-yellow-600 transition"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white focus:outline-none"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
              <div className="md:hidden bg-white px-4 pt-2 pb-4 space-y-2 shadow-lg">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.path}
                    className="block text-gray-700 hover:text-indigo-600 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
        </div>
      </Wrapper>
    </div>
  );
}
