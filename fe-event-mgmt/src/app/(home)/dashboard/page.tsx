import EventDashboard from "@/components/EventDashboard";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard Create",
};

export default async function Page() {
  const session = await auth();
  const role = session?.user?.role;
  const user = session?.user;

  if (role !== "ORGANIZER" || !user?.id) {
    redirect("/home");
  }

  const organizerId = 1; 

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="md:w-[30%] w-[90%]">
        <EventDashboard organizerId={organizerId} />
      </div>
    </div>
  );
}
