import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

async function main() {
  // Clear the database
  await prisma.task.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  // Hash passwords
  const hashedPassword1 = await hashPassword('password123');

  // Seed Users
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      password: hashedPassword1,
      name: 'User1',
      age: 30,
    },
  });

  // Seed Categories
  const workCategory = await prisma.category.create({
    data: { name: 'Work' },
  });

  const personalCategory = await prisma.category.create({
    data: { name: 'Personal' },
  });

  // Seed Tags
  const tagUrgent = await prisma.tag.create({
    data: { name: 'Urgent' },
  });

  const tagImportant = await prisma.tag.create({
    data: { name: 'Important' },
  });

  // Seed Tasks
  await prisma.task.create({
    data: {
      title: 'Finish Task Management API',
      description: 'Complete the API and set up relationships.',
      status: 'in-progress',
      dueDate: new Date('2025-01-15'),
      userId: user1.id,
      categoryId: workCategory.id,
      tags: {
        connect: [{ id: tagUrgent.id }, { id: tagImportant.id }],
      },
    },
  });

  await prisma.task.create({
    data: {
      title: 'Buy groceries',
      description: 'Milk, Bread, Eggs',
      status: 'pending',
      dueDate: new Date('2025-01-10'),
      userId: user1.id,
      categoryId: personalCategory.id,
    },
  });

  console.log('Seed data created successfully with hashed passwords!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
