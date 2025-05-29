import { ThemeProvider } from "@/context/ThemeContext";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";


export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

   const session = await auth();
 
   if(!session){
       redirect("/login")
   } 

  return (
    <div>
      <ThemeProvider>{children}</ThemeProvider>
    </div>
  );
}
