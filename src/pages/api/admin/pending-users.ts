import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Status } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Optionally: Auth check for admin
  // TODO

  const users = await prisma.user.findMany({
    where: { status: Status.PENDING },
    include: { tenant: true }
  })

  res.status(200).json({ users })
}