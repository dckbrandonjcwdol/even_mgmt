import Wrapper from "@/components/wrapper";

import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    verify(token, process.env.SECRET_KEY!);
  } catch (err) {
    redirect("/login");
  }

  return (
    <Wrapper>
      <div className="py-4 sm:py-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-300 md:my-2 text-shadow">
          Artikel <span className="text-green-700">Terkini</span>
        </h2>
        <div className="grid w-full sm:py-4 sm:gap-2 md:gap-10 grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2">
            MAIN PAGE AFTER LOGIN
          {/* {data.map((blog, idx) => {
            return <BlogCard blog={blog} key={idx} />;
          })} */}
        </div>
      </div>
    </Wrapper>
  );
}
