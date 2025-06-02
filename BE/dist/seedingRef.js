"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
async function main() {
    const locations = [
        'JCC Senayan',
        'Balai Kartini',
        'The Kasablanka Hall',
        'ICE BSD',
        'Hotel Mulia',
        'Djakarta Theater',
        'Trans Convention Center',
        'Sabuga',
        'Harris Ciumbuleuit',
        'Eldorado Dago',
        'Pullman Hotel Bandung',
        'Grand City Convex',
        'Dyandra Convention',
        'Ciputra World Surabaya',
        'Shangri-La Surabaya',
        'Pakuwon Mall',
    ];
    const categories = [
        'Music Concert',
        'Technology Expo',
        'Job Fair',
        'Startup Pitching',
        'Wedding Expo',
        'Cultural Festival',
        'Art Exhibition',
        'Comic Con',
        'Book Fair',
        'Film Festival',
        'Food & Beverage Expo',
        'Fashion Show',
        'Education Fair',
        'Auto Show',
        'Health & Wellness Expo',
    ];
    // Seed locations
    for (const name of locations) {
        await prisma.location.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }
    // // Seed categories
    // for (const name of categories) {
    //   await prisma.category.upsert({
    //     where: { name },
    //     update: {},
    //     create: { name },
    //   });
    // }
    console.log('Locations and categories seeded.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
