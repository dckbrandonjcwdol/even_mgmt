import FormCreateEvent from "@/components/event-create";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event Create",
  description: "Event Create ",
};

export default function Page() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="md:w-[30%] w-[90%]">
        <FormCreateEvent />
      </div>
    </div>
  );
}
