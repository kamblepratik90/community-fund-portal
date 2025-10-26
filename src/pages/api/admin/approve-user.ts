import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Status } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  // Optionally: Auth check for admin
  // TODO

  const { userId, action } = req.body
  if (!userId || !['APPROVE', 'REJECT'].includes(action)) {
    return res.status(400).json({ error: 'Invalid request.' })
  }

  const status = action === 'APPROVE' ? Status.ACTIVE : Status.REJECTED
  await prisma.user.update({
    where: { id: userId },
    data: { status }
  })
  // TODO: Notify user via email/WhatsApp

  res.status(200).json({ message: `User ${action === 'APPROVE' ? 'approved' : 'rejected'}` })
}