const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "PostTag", "Vote", "Comment", "Follow", "Post", "Tag", "User" RESTART IDENTITY CASCADE',
  );

  const user = await prisma.user.create({ data: { name: 'Threadbase user' } });

  await prisma.post.createMany({
    data: [
      {
        title: 'First post',
        body: 'The contract survives storage changes.',
        authorId: user.id,
      },
      {
        title: 'Second post',
        body: 'Migrations record database design.',
        authorId: user.id,
      },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
