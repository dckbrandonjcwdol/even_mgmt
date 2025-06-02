"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
async function deleteAll() {
    try {
        // Hapus dengan urutan yang aman (tabel dengan foreign key dihapus dulu)
        await prisma.promotion.deleteMany({});
        await prisma.ticketType.deleteMany({});
        await prisma.event.deleteMany({});
        // Tambah tabel lain jika ada
        console.log('✅ Semua data berhasil dihapus.');
    }
    catch (error) {
        console.error('❌ Gagal menghapus data:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
deleteAll();
