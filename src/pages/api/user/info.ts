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

        // Find user and their tenant
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { tenant: true },
        });
        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                relation: user.relation,
                status: user.status,
                tenantId: user.tenantId,
            },
            tenant: {
                id: user.tenant.id,
                name: user.tenant.name,
                address: user.tenant.address,
            },
        });
    } catch (error) {
        console.error("API /api/user/info error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}