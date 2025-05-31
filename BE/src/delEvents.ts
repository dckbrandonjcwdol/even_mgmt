
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function deleteAll() {
  try {
    // Hapus dengan urutan yang aman (tabel dengan foreign key dihapus dulu)
    await prisma.promotion.deleteMany({});
    await prisma.ticketType.deleteMany({});
    await prisma.event.deleteMany({});
    // Tambah tabel lain jika ada

    console.log('✅ Semua data berhasil dihapus.');
  } catch (error) {
    console.error('❌ Gagal menghapus data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAll();
