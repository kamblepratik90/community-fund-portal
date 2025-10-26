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

        // Find user to get tenantId
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });
        if (!user) return res.status(404).json({ error: "User not found" });

        const members = await prisma.user.findMany({
            where: { tenantId: user.tenantId },
            select: {
                id: true, name: true, email: true, relation: true, status: true
            },
            orderBy: { name: "asc" },
        });

        res.status(200).json({ members });
    } catch (error) {
        console.error("API /api/user/members error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}