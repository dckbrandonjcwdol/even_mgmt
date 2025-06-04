"use client";

import Link from "next/link";
import Image from "next/image";
import Wrapper from "./wrapper";
import Logout from "./logout";
import { getBrandName } from "@/lib/brand";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";

const navItems = [
  { label: "About Us", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "SignUp", path: "/register" },
];

const navOrgItems = [
  { label: "About Us", path: "/about" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Buy", path: "/event-buy" },
  { label: "AddEvent", path: "/event-create" },
];

const navCustItems = [
  { label: "About Us", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Buy", path: "/event-buy" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();


  console.log("Session (client useEffect):", session, status);
  console.log("name: ", session?.user.name);
  console.log("Role: ", session?.user.role);

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
          <div className="hidden md:flex items-center space-x-6">
            {session?.user ? (
              <>
                {
                  session?.user.role=="ORGANIZER" ? (
                    navOrgItems.map((item, index) => (
                      <Link
                        key={index}
                        href={item.path}
                        className="hover:text-yellow-600 transition"
                      >
                        {item.label}
                      </Link>
                    ))
                  ) : (
                    navCustItems.map((item, index) => (
                      <Link
                        key={index}
                        href={item.path}
                        className="hover:text-yellow-600 transition"
                      >
                        {item.label}
                      </Link>
                    ))
                  )
                }
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700 text-sm font-medium">
                    {session.user.name}
                  </span>
                  <Logout />
                </div>
              </>
            ) : (
              <>
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.path}
                    className="hover:text-yellow-600 transition"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/login"
                  className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-teal-600 rounded-lg"
                >
                  Login
                </Link>
              </>
            )}
          </div>


          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white px-4 pt-2 pb-4 space-y-2 shadow-lg">
            {session?.user ? (
              <>
                <div className="flex flex-col space-y-2">
                  {session?.user.role === "ORGANIZER" ? (
                    navOrgItems.map((item, index) => (
                      <Link
                        key={index}
                        href={item.path}
                        className="hover:text-yellow-600 transition"
                      >
                        {item.label}
                      </Link>
                    ))
                  ) : (
                    navCustItems.map((item, index) => (
                      <Link
                        key={index}
                        href={item.path}
                        className="hover:text-yellow-600 transition"
                      >
                        {item.label}
                      </Link>
                    ))
                  )}
                </div>

                <div className="flex items-center justify-between border-t pt-2 mt-5">
                  <div>
                    <span className="text-gray-700 text-sm font-medium">
                      {session.user.name}
                    </span>
                  </div>
                  <div>
                    <Logout />
                  </div>
                </div>
              </>
            ) : (
              <>
                {navItems.map((item, index) => (
                  <div key={index}>
                    <Link
                      href={item.path}
                      className="block text-gray-700 hover:text-indigo-600 transition"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </div>
                ))}
                <div>
                  <Link
                    href="/login"
                    className="block text-center text-sm font-medium text-white bg-green-700 rounded-lg px-3 py-1 hover:bg-green-800"
                  >
                    Login
                  </Link>
                </div>
              </>
            )}
          </div>
        )}

      </Wrapper>
    </div>
  );
}
