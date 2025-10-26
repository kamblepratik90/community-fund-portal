import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, PaymentStatus } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const payments = await prisma.payment.findMany({
    where: { status: PaymentStatus.PENDING },
    include: {
      user: { include: { tenant: true } },
    },
    orderBy: [{ createdAt: "desc" }],
  });
  res.status(200).json({ payments });
}