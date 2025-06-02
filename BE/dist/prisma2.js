"use strict";
// import { PrismaClient } from "../generated/prisma"; // atau dari "@prisma/client" jika default
// const prisma = new PrismaClient();
// async function main() {
//   const users = await prisma.user.findMany({
//     where: {
//       referredBy: null,
//       NOT: {
//         referredBy_temp: null,
//       },
//     },
//     select: {
//       id: true,
//       referredBy_temp: true,
//     },
//   });
//   for (const user of users) {
//     const refBy = parseInt(user.referredBy_temp || "");
//     if (!isNaN(refBy)) {
//       await prisma.user.update({
//         where: { id: user.id },
//         data: { referredBy: refBy },
//       });
//       console.log(`✅ Updated user ${user.id} with referredBy ${refBy}`);
//     } else {
//       console.warn(`⚠️  Skipping user ${user.id}, invalid referredBy_temp: ${user.referredBy_temp}`);
//     }
//   }
//   console.log("✅ Migrasi selesai.");
// }
// main()
//   .catch((e) => {
//     console.error("❌ Error:", e);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
