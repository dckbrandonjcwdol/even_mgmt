import FormCreateEvent from "@/components/event-create";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Event Create",
  description: "Event Create",
};

// ✅ Tambahkan keyword `async` agar bisa pakai `await` di dalamnya
export default async function Page() {
  const session = await auth();
  const role = session?.user?.role;

  if (role !== "ORGANIZER") {
    redirect("/home");
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="md:w-[30%] w-[90%]">
        <FormCreateEvent />
      </div>
    </div>
  );
}
