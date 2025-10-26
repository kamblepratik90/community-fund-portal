import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === "PUT" || req.method === "PATCH") {
    const { name, address } = req.body;
    if (!name || !address) {
      return res.status(400).json({ error: "Name and address are required." });
    }
    const updated = await prisma.tenant.update({
      where: { id: id as string },
      data: { name, address },
    });
    return res.status(200).json({ tenant: updated });
  }

  if (req.method === "GET") {
    const tenant = await prisma.tenant.findUnique({
      where: { id: id as string },
      include: { users: true },
    });
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });
    return res.status(200).json({ tenant });
  }

  res.status(405).json({ error: "Method not allowed" });
}