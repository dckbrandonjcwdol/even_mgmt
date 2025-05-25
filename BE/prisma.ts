import { PrismaClient } from "./src/generated/prisma";


export default new  PrismaClient({log: ["query", "info", "warn", "error"]});

