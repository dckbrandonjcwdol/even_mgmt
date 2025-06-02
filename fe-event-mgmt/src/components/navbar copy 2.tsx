"use client";

import Link from "next/link";
import Wrapper from "./wrapper";
import Image from "next/image";
import { auth } from "@/lib/auth";
import Logout from "./logout";
import { getBrandName } from "@/lib/brand";

// import Theme from "./theme";
import { useState } from 'react';
import { Menu, X } from "lucide-react";

export default async function Navbar() {
  const data = await auth();
  const [isOpen, setIsOpen] = useState(false);

  // Ubah dari nama menjadi rute langsung
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
              { getBrandName()}
            </span>
          </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-6">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.path}
                  className="text-white hover:text-yellow-300 transition"
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
{/* 
          {data ? (
              <div className="flex items-center gap-3 h-[30px]">
                <span className="text-sm font-medium text-gray-700">
                  {data.user.username}
                </span>
                <Logout />
                
              </div>
            ) : (
              <div className="flex gap-2 h-[30px]">
                <Link
                  href="/login"
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-orange-700 rounded-lg hover:bg-orange-800"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center border px-3 py-2 text-sm font-medium text-black bg-white rounded-lg hover:bg-gray-100"
                >
                  Register
                </Link>
              </div>
          )} */}
        </div>
      </Wrapper>
    </div>
  );
}
