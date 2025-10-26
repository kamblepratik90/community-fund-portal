import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Status, Relation, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { tenantId, name, relation, mobile, email, password } = req.body

  // Validate input
  if (!tenantId || !name || !relation || !mobile || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' })
  }

  // Check if email or mobile already exists
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { mobile }]
    }
  })
  if (existing) {
    return res.status(409).json({ error: 'Email or mobile already registered.' })
  }

  // Hash the password
  const passwordHash = await bcrypt.hash(password, 10)

  // Create user (pending approval)
  try {
    const user = await prisma.user.create({
      data: {
        name,
        relation,
        mobile,
        email,
        passwordHash,
        tenantId,
        status: Status.PENDING,
        role: Role.TENANT
      }
    })

    // TODO: Send notification to admin (email/WhatsApp)

    return res.status(201).json({ message: 'Registration request submitted.', userId: user.id })
  } catch (error) {
    return res.status(500).json({ error: 'Failed to register user.' })
  }
}