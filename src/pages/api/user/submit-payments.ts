import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient, PaymentStatus } from "@prisma/client";
import formidable from "formidable";
import fs from "fs";

export const config = { api: { bodyParser: false } };
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Unauthorized" });

  const userEmail = session.user.email;
  // Parse form data with formidable (for file upload)
  const form = new formidable.IncomingForm();
  form.uploadDir = "./public/payment-proofs";
  form.keepExtensions = true;

  form.parse(req, async (err: Error, fields: formidable.Fields, files: formidable.Files) => {
    if (err) return res.status(400).json({ error: "File upload error" });

    const { amount } = fields;
    const proof = files.proof as formidable.File;
    if (!amount || !proof) return res.status(400).json({ error: "Missing data" });

    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Save file and get URL
    const proofPath = `/payment-proofs/${proof.newFilename}`;
    // Get current month/year
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Save payment record
    await prisma.payment.create({
      data: {
        userId: user.id,
        id: user.tenantId,
        amount: Number(amount),
        month,
        year,
        status: PaymentStatus.PENDING,
        proofUrl: proofPath,
      }
    });
    res.status(200).json({ message: "Payment submitted and pending approval." });
  });
}