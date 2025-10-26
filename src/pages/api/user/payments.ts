import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getServerSession(req, res, authOptions);
        if (!session?.user?.email) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Find user and their tenantId
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });
        if (!user) return res.status(404).json({ error: "User not found" });

        const payments = await prisma.payment.findMany({
            where: { id : user.tenantId },
            orderBy: [{ year: "desc" }, { month: "desc" }],
        });

        res.status(200).json({ payments });
    } catch (error) {
        console.error("API /api/user/payments error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}