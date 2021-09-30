"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const aleksei = await prisma.user.upsert({
        where: { email: 'alekseisweet@protonmail.com' },
        update: {},
        create: {
            email: 'alekseisweet@protonmail.com',
            username: 'aleksei',
        },
    });
}
//# sourceMappingURL=seed.js.map