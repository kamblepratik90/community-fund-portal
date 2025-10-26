import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { status } = req.body; // "ACTIVE" or "REJECTED"
  if (!["ACTIVE", "REJECTED"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  // Update all users in this tenant
  await prisma.user.updateMany({
    where: { tenantId: id as string },
    data: { status },
  });
  res.status(200).json({ message: "Tenant users updated" });
}