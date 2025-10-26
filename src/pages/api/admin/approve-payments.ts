import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, PaymentStatus } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { paymentId, action, adminNote } = req.body;
  if (!paymentId || !["APPROVE", "REJECT"].includes(action)) {
    return res.status(400).json({ error: "Invalid request." });
  }
  const status = action === "APPROVE" ? PaymentStatus.APPROVED : PaymentStatus.REJECTED;
  await prisma.payment.update({
    where: { id: paymentId },
    data: { status, adminNote },
  });
  // TODO: Notify user
  res.status(200).json({ message: `Payment ${action === "APPROVE" ? "approved" : "rejected"}` });
}