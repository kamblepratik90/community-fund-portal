import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  // Optionally: Add search by name with req.query.search
  const search = (req.query.search as string) || "";
  const tenants = await prisma.tenant.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    include: {
      users: true, // get all users (family members) for each tenant
    },
    orderBy: [{ name: "asc" }],
  });
  res.status(200).json({ tenants });
}