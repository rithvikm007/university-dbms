import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from "bcrypt"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST, 
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,  
  database: process.env.DB_NAME,  
});

const createAdminUser = async () => {
  try {
    const existingAdmin = await sequelize.query(
      `SELECT * FROM "users" WHERE email = 'root@gmail.com' LIMIT 1;`,
      { type: sequelize.QueryTypes.SELECT }
    );

    if (existingAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash("root", 10);

      await sequelize.query(
        `INSERT INTO "users" ("name", "email", "phone_no", "user_type", "password", "createdAt", "updatedAt")
         VALUES ('Root', 'root@gmail.com', '0000000000', 'admin', :password, NOW(), NOW());`,
        { replacements: { password: hashedPassword } }
      );

      console.log("✅ Default admin user created!");
    } else {
      console.log("ℹ️ Admin user already exists.");
    }
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  }
};


const createEnumAndTable = async () => {
  try {
    await sequelize.query(`
      DROP TYPE IF EXISTS public.enum_users_user_type;
      DROP TYPE IF EXISTS public.enum_faculty_role;
      DROP TYPE IF EXISTS public.enum_attendance_status;
      DROP TYPE IF EXISTS public.enum_exam_type;
    `);

    // Create enum types
    await sequelize.query(`
      CREATE TYPE public.enum_users_user_type AS ENUM ('student', 'faculty', 'admin');
      CREATE TYPE public.enum_faculty_role AS ENUM ('professor', 'assistant_professor', 'associate_professor');
      CREATE TYPE public.enum_attendance_status AS ENUM ('Present', 'Absent', 'Late');
      CREATE TYPE public.enum_exam_type AS ENUM ('Midterm', 'Final', 'Quiz');
    `);

    // Create the Users table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "user_id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "email" VARCHAR(255) NOT NULL UNIQUE,
        "phone_no" VARCHAR(15) NOT NULL,
        "user_type" public.enum_users_user_type NOT NULL,
        "password" TEXT NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      );
    `);

    
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "departments" (
        "department_id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "hod_id" INTEGER
      );
    `);
    // Create the Faculties table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "faculties" (
        "faculty_id" INTEGER PRIMARY KEY REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
        "department_id" INTEGER NOT NULL REFERENCES "departments"("department_id") ON DELETE RESTRICT ON UPDATE CASCADE,
        "role" public.enum_faculty_role NOT NULL
      );
    `);

    // Create the Students table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "students" (
        "student_id" INTEGER PRIMARY KEY REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
        "dob" DATE NOT NULL,
        "admission_year" INTEGER NOT NULL,
        "graduation_year" INTEGER,
        "department_id" INTEGER NOT NULL REFERENCES "departments"("department_id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `);


    // Create the Courses table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "courses" (
        "course_id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL,
        "credits" INTEGER NOT NULL,
        "semester" INTEGER NOT NULL,
        "department_id" INTEGER NOT NULL REFERENCES "departments"("department_id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `);

     // Create the Enrollments table if it doesn't exist
     await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "enrollments" (
        "student_id" INTEGER NOT NULL REFERENCES "students"("student_id") ON DELETE CASCADE ON UPDATE CASCADE,
        "course_id" INTEGER NOT NULL REFERENCES "courses"("course_id") ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY ("student_id", "course_id")
      );
    `);

    // Create the Classes table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "classes" (
        "course_id" INTEGER NOT NULL REFERENCES "courses"("course_id") ON DELETE CASCADE ON UPDATE CASCADE,
        "faculty_id" INTEGER NOT NULL REFERENCES "faculties"("faculty_id") ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY ("course_id", "faculty_id")
      );
    `);

    // Create the Attendance table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "attendance" (
        "student_id" INTEGER NOT NULL REFERENCES "students"("student_id") ON DELETE CASCADE ON UPDATE CASCADE,
        "course_id" INTEGER NOT NULL REFERENCES "courses"("course_id") ON DELETE CASCADE ON UPDATE CASCADE,
        "date" DATE NOT NULL,
        "status" public.enum_attendance_status DEFAULT 'Absent',
        PRIMARY KEY ("student_id", "course_id", "date")
      );
    `);

    // Create the Exams table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "exams" (
        "exam_id" SERIAL PRIMARY KEY,
        "course_id" INTEGER NOT NULL REFERENCES "courses"("course_id") ON DELETE CASCADE ON UPDATE CASCADE,
        "date" DATE NOT NULL,
        "type" public.enum_exam_type NOT NULL
      );
    `);

    // Create the ExamResults table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "examresults" (
        "student_id" INTEGER NOT NULL REFERENCES "students"("student_id") ON DELETE CASCADE ON UPDATE CASCADE,
        "exam_id" INTEGER NOT NULL REFERENCES "exams"("exam_id") ON DELETE CASCADE ON UPDATE CASCADE,
        "marks" INTEGER NOT NULL,
        "grade" TEXT NOT NULL,
        PRIMARY KEY ("student_id", "exam_id")
      );
    `);

    // Add foreign key constraints
    await sequelize.query(`
      ALTER TABLE "departments"
      ADD CONSTRAINT "fk_hod_id"
      FOREIGN KEY ("hod_id") REFERENCES "faculties"("faculty_id") ON DELETE RESTRICT ON UPDATE CASCADE;
    `);

    console.log('✅ Tables and enums created successfully!');
  } catch (error) {
    console.error('❌ Error creating tables and enums:', error);
  }
};

const initializeDatabase = async () => {
  await createEnumAndTable();
  await createAdminUser(); 
};

initializeDatabase();