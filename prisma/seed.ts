import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  const adminHash = await bcrypt.hash("admin123", 12)
  await prisma.user.upsert({
    where: { email: "admin@ibnmandour.ma" },
    update: {},
    create: {
      email: "admin@ibnmandour.ma",
      passwordHash: adminHash,
      firstName: "Admin",
      lastName: "Ibn Mandour",
      role: Role.ADMIN,
      adminProfile: { create: {} },
    },
  })
  console.log("Created admin")

  const teacherHash = await bcrypt.hash("teacher123", 12)
  await prisma.user.upsert({
    where: { email: "teacher@ibnmandour.ma" },
    update: {},
    create: {
      email: "teacher@ibnmandour.ma",
      passwordHash: teacherHash,
      firstName: "Ahmed",
      lastName: "Alami",
      role: Role.TEACHER,
      teacherProfile: {
        create: {
          subjects: ["Mathématiques", "Physique"],
          classes: ["TC-SC-1", "1BAC-SM-A"],
        },
      },
    },
  })
  console.log("Created teacher")

  const studentHash = await bcrypt.hash("student123", 12)
  const student = await prisma.user.upsert({
    where: { email: "student@ibnmandour.ma" },
    update: {},
    create: {
      email: "student@ibnmandour.ma",
      passwordHash: studentHash,
      firstName: "Youssef",
      lastName: "Benali",
      role: Role.STUDENT,
      studentProfile: {
        create: {
          massarClass: "1BAC-SM-A",
          enrollmentYear: 2025,
        },
      },
    },
    include: { studentProfile: true },
  })
  console.log("Created student")

  const parentHash = await bcrypt.hash("parent123", 12)
  await prisma.user.upsert({
    where: { email: "parent@ibnmandour.ma" },
    update: {},
    create: {
      email: "parent@ibnmandour.ma",
      passwordHash: parentHash,
      firstName: "Fatima",
      lastName: "Benali",
      role: Role.PARENT,
      parentProfile: {
        create: {
          children: {
            connect: { id: student.studentProfile!.id },
          },
        },
      },
    },
  })
  console.log("Created parent")

  console.log("Seed complete!")
  console.log("\nTest accounts:")
  console.log("  Admin:  admin@ibnmandour.ma / admin123")
  console.log("  Teacher: teacher@ibnmandour.ma / teacher123")
  console.log("  Student: student@ibnmandour.ma / student123")
  console.log("  Parent:  parent@ibnmandour.ma / parent123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
