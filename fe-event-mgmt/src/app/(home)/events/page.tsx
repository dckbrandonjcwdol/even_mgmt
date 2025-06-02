import EventListPage from "@/components/EventListPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event List",
  description: "Event List ",
};

export default function Page() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="md:w-[30%] w-[90%]">
        <EventListPage />
      </div>
    </div>
  );
}
