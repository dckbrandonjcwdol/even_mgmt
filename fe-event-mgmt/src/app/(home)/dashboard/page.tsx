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

  return (
    <div className="w-full min-h-screen pt-20 px-4 flex justify-center">
      <div className="w-full max-w-2xl">     
        <EventDashboard />
      </div>
    </div>
  );
}
