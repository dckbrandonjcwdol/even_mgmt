// import { PrismaClient } from "../generated/prisma";

// const prisma = new PrismaClient();

// async function main() {
//   await prisma.userType.createMany({
//     data: [
//       { id: 1, user_type_name: "Admin" },
//       { id: 2, user_type_name: "Event Organizer" },
//       { id: 3, user_type_name: "Participant" },
//     ],
//     skipDuplicates: true,
//   });

//   console.log("User types inserted (if not duplicates).");
// }

// main()
//   .catch((e) => {
//     console.error("Error:", e);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
