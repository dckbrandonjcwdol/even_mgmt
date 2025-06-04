"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function Profile() {
  const { data: session, status } = useSession();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (session?.user?.referralCode) {
      navigator.clipboard.writeText(session.user.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg">Loading session...</p>
      </div>
    );
  }

  if (status === "unauthenticated" || !session?.user) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-600 text-lg">You are not logged in</p>
      </div>
    );
  }

  const { name, email, role, referralCode, points } = session.user;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold text-green-800">
        <span className="text-green-600">👤</span> My Profile
      </h2>
      <div className="space-y-1">
        <p><span className="font-semibold">Name:</span> {name}</p>
        <p><span className="font-semibold">Email:</span> {email}</p>
        <p><span className="font-semibold">Role:</span> {role ?? "-"}</p>
        <div className="flex items-center gap-2">
          <p><span className="font-semibold">Referral Code:</span> {referralCode ?? "-"}</p>
          {referralCode && (
            <button
              onClick={handleCopy}
              className="text-sm bg-green-600 text-white rounded hover:bg-green-700 px-2 py-1"
              style={{ width: "auto", minWidth: "unset" }}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          )}
        </div>
        <p><span className="font-semibold">Total Points:</span> {points ?? 0}</p>
      </div>
    </div>
  );
}
