// import BlogCard from "@/components/blog/card";
import Sidebar from "@/components/sidebar";
import Wrapper from "@/components/wrapper";
import { auth } from "@/lib/auth";
// import { IBlog } from "@/types/blog";
import { redirect } from "next/navigation";

export default async function Home() {

  const res = await fetch(
    "https://saucysmile-us.backendless.app/api/data/Blogs?loadRelations=author"
  );

  // const res = await fetch(
  //   "https://buffbasket-us.backendless.app/api/data/Blogs?loadRelations=author"
  // );

  
  
  // const data: IBlog[] = await res.json();

  return (
    <Wrapper>
      <div className="min-h-screen flex flex-col">
        <div className="flex flex-1">
          <aside className="hidden md:block w-64">
            <Sidebar />
          </aside>
          <main className="flex-1 p-6 bg-gray-50">
            <h2 className="text-2xl font-semibold mb-4">Event Details</h2>
            <div className="bg-white rounded-lg shadow p-6">
              {/* Konten event di sini */}
              <p className="text-gray-700">
                Welcome to your event management page. Start building your event now!
              </p>
            </div>
          </main>
        </div>
      </div>
    </Wrapper>
  );
}
