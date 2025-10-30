/**
 * @type {import('@prisma/client').Prisma.Config}
 */
const config = {
  schema: "./prisma/schema.prisma",
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
}

export default config;
.