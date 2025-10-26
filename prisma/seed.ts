import { PrismaClient, Role, Status, Relation } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log("Starting seed...");

  // Example tenants
  const tenant1 = await prisma.tenant.create({
    data: { name: 'Patel - House 1', address: 'Block A-1' }
  });
  const tenant2 = await prisma.tenant.create({
    data: { name: 'Sharma - House 2', address: 'Block B-2' }
  });

  // Example admin user
  const hash = await bcrypt.hash('adminpassword', 10);
  await prisma.user.create({
    data: {
      tenantId: tenant1.id,
      name: 'Admin',
      relation: Relation.SELF,
      mobile: '9999999999',
      email: 'admin@community.org',
      passwordHash: hash,
      status: Status.ACTIVE,
      role: Role.ADMIN,
    }
  });

  console.log("Seeding finished!");
}

main()
  .catch(e => {
    console.error("Error in seeding:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())