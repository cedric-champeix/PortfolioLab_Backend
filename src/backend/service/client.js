const primaClient = require("@prisma/client");

const prisma = new primaClient.PrismaClient();

module.exports = prisma;