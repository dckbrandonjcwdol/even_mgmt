"use client";

import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

export default function VerifyPage({ token }: { token: string }) {
  const [msg, setMsg] = useState<string>("");

  const onVerify = useCallback(async () => {
    try {
      setMsg("Waiting ...");
      const { data } = await axios.patch(
        "/auth/verify",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMsg(data.message);
    } catch (err) {
      if (err instanceof AxiosError) {
        setMsg(err.response?.data?.message);
      } else {
        setMsg("Verification Failed!");
      }
    }
  }, [token]);

  useEffect(() => {
    onVerify();
  }, [onVerify]);

  return (
    <div className="flex w-full h-screen justify-center items-center perspective-1000 bg-white">
      <div className="text-black flex gap-2 animate-bounce">
        <Image
          alt="logo-eventique"
          src={"/logo4.png"}
          width={100}
          height={100}
          className="h-8 w-8"
          priority
        />
        <span className="self-center text-2xl font-semibold whitespace-nowrap animate-pulse">
          {msg}
        </span>
      </div>
    </div>
  );
}