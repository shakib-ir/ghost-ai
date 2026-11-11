import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured");
}

function localPostgresUrl(url: string) {
  if (!url.startsWith("prisma+postgres://")) return null;

  try {
    const apiKey = new URL(url).searchParams.get("api_key");
    // Prisma Dev uses a base64url-encoded JSON key, while remote Prisma
    // Accelerate keys use a JWT-shaped value. Support both formats.
    const payload = apiKey?.includes(".") ? apiKey.split(".")[1] : apiKey;
    if (!payload) return null;

    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      databaseUrl?: string;
    };
    const directUrl = decoded.databaseUrl;

    return directUrl?.includes("localhost") || directUrl?.includes("127.0.0.1")
      ? directUrl
      : null;
  } catch {
    return null;
  }
}

const createPrismaClient = () => {
  if (databaseUrl.startsWith("prisma+postgres://")) {
    const directUrl = localPostgresUrl(databaseUrl);
    if (!directUrl) return new PrismaClient({ accelerateUrl: databaseUrl });
    return new PrismaClient({ adapter: new PrismaPg({ connectionString: directUrl }) });
  }

  const adapter = new PrismaPg({ connectionString: databaseUrl });
  return new PrismaClient({ adapter });
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
