import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Returns the singleton PrismaClient instance, instantiating it lazily
 * so module evaluation during Next.js build time does not fail if database
 * environment variables are evaluated during static collection.
 */
function getPrismaClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["error", "warn"]
          : ["error"],
    });
  }
  return globalForPrisma.prisma;
}

/**
 * Lazy proxy export: `prisma.contactMessage` will only instantiate
 * PrismaClient upon first actual database query call, preventing
 * build-time evaluation failures on platforms like Vercel.
 */
export type ExtendedPrismaClient = PrismaClient & {
  [key: string]: any;
};

export const prisma: ExtendedPrismaClient = new Proxy({} as any, {
  get(_target, prop: string | symbol) {
    const client = getPrismaClient();
    const value = (client as any)[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

export default prisma;
