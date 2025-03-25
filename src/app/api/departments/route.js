import { NextResponse } from 'next/server';
import Department from '@/models/Department';
import Faculty from '@/models/Faculty';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import sequelize from '@/utils/db';

// Fetch all departments
export async function GET() {
  try {
    const departments = await Department.findAll({
      order: [['department_id', 'ASC']],
    });
    return NextResponse.json({ departments });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 });
  }
}

// Add a new department
export async function POST(req) {
  const transaction = await sequelize.transaction(); 

  try {
    const { name, hod } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Department name is required" }, { status: 400 });
    }

    const department = await Department.create({ name }, { transaction });

    if (hod) {
      const existingUser = await User.findOne({ where: { email: hod.email }, transaction });

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      const hashedPassword = await bcrypt.hash(hod.password, 10);

      const user = await User.create(
        {
          name: hod.name,
          email: hod.email,
          phone_no: hod.phone_no,
          password: hashedPassword,
          user_type: "faculty",
        },
        { transaction }
      );
      console.log(hod);
      const faculty = await Faculty.create(
        {
          faculty_id: user.user_id,
          department_id: department.department_id,
          role: hod.role,
        },
        { transaction }
      );
      await department.update(
        { hod_id: faculty.faculty_id },
        { transaction }
      );
    }

    await transaction.commit();

    return NextResponse.json(
      { message: "Department added successfully", department },
      { status: 201 }
    );
  } catch (error) {
    await transaction.rollback();
    console.error("Error adding department:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add department" },
      { status: 500 }
    );
  }
}