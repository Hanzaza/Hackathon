import { config } from 'dotenv';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

config();

const { PrismaClient } = require('@prisma/client');

const databaseUrl = process.env.DATABASE_URL ?? process.env.DIRECT_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL or DIRECT_URL is not defined in the environment.');
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.country.createMany({
    data: [
      { name: 'Nicaragua', slug: 'nicaragua', isoCode: 'NI' },
    ],
    skipDuplicates: true,
  });

  await prisma.department.createMany({
    data: [
      { name: 'Managua', slug: 'managua', description: 'Departamento de ejemplo', isCreativeRegion: true },
      { name: 'Granada', slug: 'granada', description: 'Departamento de ejemplo', isCreativeRegion: true },
    ],
    skipDuplicates: true,
  });

  await prisma.municipality.createMany({
    data: [
      { name: 'Managua', slug: 'managua-city', description: 'Municipio de ejemplo', isCreative: true, municipalityType: 'creativa', departmentName: 'Managua' },
      { name: 'Granada', slug: 'granada-city', description: 'Municipio de ejemplo', isCreative: true, municipalityType: 'creativa', departmentName: 'Granada' },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
