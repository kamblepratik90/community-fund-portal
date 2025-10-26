import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (req.method === "PATCH" || req.method === "PUT") {
    const { name, relation, email, mobile, status, role } = req.body;
    const user = await prisma.user.update({
      where: { id: id as string },
      data: { name, relation, email, mobile, status, role },
    });
    return res.status(200).json({ user });
  }
  if (req.method === "GET") {
    const user = await prisma.user.findUnique({ where: { id: id as string } });
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json({ user });
  }
  res.status(405).json({ error: "Method not allowed" });
}