import * as Prisma from '@prisma/client';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: Prisma.PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma ||
  new Prisma.PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;