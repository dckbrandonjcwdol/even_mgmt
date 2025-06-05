// import { getSession } from "next-auth/react";
// import { redirect } from "next/navigation";
import FormBuyTicket from "@/components/buy/form";



export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  // const session = await getSession();

  // if (!session?.user || session.user.role !== "ORGANIZER") {
  //   redirect("/home");
  // }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="md:w-[30%] w-[90%]">
        {/* <div className="text-gray-700 text-center mb-4">ID: {id}</div> */}
        <FormBuyTicket id={id} />
      </div>
    </div>
  );
}
