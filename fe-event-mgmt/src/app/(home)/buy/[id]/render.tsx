"use client";

import FormBuyTicket from "@/components/buy/form";

export default function BuyTicketPage({ id }: { id: string }) {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="md:w-[30%] w-[90%]">
        {/* <div className="text-gray-700 text-center mb-4">ID: {id}</div> */}
        <FormBuyTicket id={id} />
      </div>
    </div>
  );
}
