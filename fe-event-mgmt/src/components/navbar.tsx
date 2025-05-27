import Link from "next/link";
import Wrapper from "./wrapper";
import Image from "next/image";
import { auth } from "@/lib/auth";
import Logout from "./logout";
import { getBrandName } from "@/lib/brand";

export default async function Navbar() {
  const data = await auth();

  return (
    <div className="sticky top-0 z-10 bg-white shadow-sm">
      <Wrapper>
        <div className="h-[60px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              alt="Eventique Logo"
              src="/logo.png"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
              priority
            />
            <span className="text-2xl font-semibold whitespace-nowrap">
              { getBrandName()}
            </span>
          </Link>

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
          )}
        </div>
      </Wrapper>
    </div>
  );
}
