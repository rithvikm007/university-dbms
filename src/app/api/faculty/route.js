import { NextResponse } from "next/server";
import Faculty from "@/models/Faculty";
import User from "@/models/User";
import Department from "@/models/Department";
import bcrypt from "bcryptjs";
import sequelize from "@/utils/db";

// Fetch all faculty members
export async function GET() {
  try {
    const facultyList = await Faculty.findAll({
      include: [
        {
          model: User,
          attributes: ["name", "email", "phone_no"], 
        },
        {
          model: Department, 
          attributes: ["name"], 
        },
      ],
      order: [['faculty_id', 'ASC']],
    });

    const facultyData = facultyList.map((faculty) => ({
      faculty_id: faculty.faculty_id,
      department_id: faculty.department_id,
      department_name: faculty.Department?.name || "Unknown",
      role: faculty.role,
      name: faculty.User?.name,  
      email: faculty.User?.email,
    }));

    return NextResponse.json({ faculty: facultyData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching faculty members:", error);
    return NextResponse.json(
      { error: "Failed to fetch faculty members" },
      { status: 500 }
    );
  }
}


// Add a new faculty member
export async function POST(req) {
  const t = await sequelize.transaction();
  try {
    const { name, email, password, departmentId, role, phone_no } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create(
      {
        name,
        email,
        phone_no,
        password: hashedPassword,
        user_type: "faculty",
      },
      { transaction: t }
    );

    console.log("New user_id:", newUser.user_id);

    const newFaculty = await Faculty.create(
      {
        faculty_id: newUser.user_id, 
        department_id: departmentId,
        role,
      },
      { transaction: t }
    );

    await t.commit();

    return NextResponse.json(
      { message: "Faculty added successfully", faculty: newFaculty },
      { status: 201 }
    );
  } catch (error) {
    await t.rollback();
    console.error("Error adding faculty member:", error);
    return NextResponse.json(
      { error: "Failed to add faculty member" },
      { status: 500 }
    );
  }
}