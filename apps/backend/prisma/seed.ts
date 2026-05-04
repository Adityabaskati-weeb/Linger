import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("campusiq123", 10);

  const department = await prisma.department.upsert({
    where: { code: "CS" },
    update: {},
    create: {
      name: "Computer Science",
      code: "CS"
    }
  });

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@campusiq.edu" },
    update: {},
    create: {
      email: "admin@campusiq.edu",
      password,
      role: Role.ADMIN,
      name: "Principal Kavita Menon",
      admin: {
        create: {
          title: "Principal"
        }
      }
    }
  });

  const facultyUser = await prisma.user.upsert({
    where: { email: "faculty@campusiq.edu" },
    update: {},
    create: {
      email: "faculty@campusiq.edu",
      password,
      role: Role.FACULTY,
      name: "Dr. Nisha Rao",
      faculty: {
        create: {
          employeeId: "FAC-CS-001",
          departmentId: department.id,
          weeklyHours: 18,
          subjectPreferences: ["Data Structures", "Graph Algorithms"]
        }
      }
    },
    include: { faculty: true }
  });

  const course = await prisma.course.upsert({
    where: { code: "CS301" },
    update: {},
    create: {
      name: "Data Structures",
      code: "CS301",
      semester: 5,
      credits: 4,
      departmentId: department.id
    }
  });

  const subject = await prisma.subject.create({
    data: {
      name: "Graph Algorithms",
      courseId: course.id,
      materials: {
        create: {
          title: "Graph Algorithms Primer",
          content:
            "Graphs model relationships between entities using vertices and edges. Breadth-first search explores neighbors level by level and is used for shortest paths in unweighted graphs. Depth-first search explores as far as possible before backtracking and is useful for cycle detection, topological ordering, and connected component analysis.",
          uploadedBy: facultyUser.id
        }
      }
    }
  });

  if (facultyUser.faculty) {
    await prisma.facultySubject.upsert({
      where: {
        facultyId_subjectId: {
          facultyId: facultyUser.faculty.id,
          subjectId: subject.id
        }
      },
      update: {},
      create: {
        facultyId: facultyUser.faculty.id,
        subjectId: subject.id
      }
    });
  }

  const studentUser = await prisma.user.upsert({
    where: { email: "student@campusiq.edu" },
    update: {},
    create: {
      email: "student@campusiq.edu",
      password,
      role: Role.STUDENT,
      name: "Aarav Mehta",
      student: {
        create: {
          rollNumber: "CS25-047",
          departmentId: department.id,
          semester: 5,
          enrollments: {
            create: {
              courseId: course.id
            }
          }
        }
      }
    }
  });

  console.log(`Seeded CampusIQ demo users: ${adminUser.email}, ${facultyUser.email}, ${studentUser.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
