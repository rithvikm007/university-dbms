import { NextResponse } from "next/server";
import Student from "@/models/Student";
import User from "@/models/User";
import Department from "@/models/Department";
import bcrypt from "bcryptjs";
import sequelize from "@/utils/db";

// Fetch all Students
export async function GET() {
  try {
    const studentsList = await Student.findAll({
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
      order: [['student_id', 'ASC']],
    });

    const studentData = studentsList.map((student) => ({
      student_id: student.student_id,
      department_id: student.department_id,
      department_name: student.Department?.name || "Unknown",
      name: student.User?.name,  
      email: student.User?.email,
    }));

    return NextResponse.json({ students: studentData }, { status: 200 });

  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}


// Add a new Student
export async function POST(req) {
  const t = await sequelize.transaction();
  try {
    let { name, email, password, departmentId, admission_year, graduation_year, dob, phone_no } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create(
      {
        name,
        email,
        phone_no,
        password: hashedPassword,
        user_type: "student",
      },
      { transaction: t }
    );

    console.log("New user_id:", newUser.user_id);
    if(graduation_year== "") graduation_year = null; 

    const newStudent = await Student.create(
      {
        student_id: newUser.user_id, 
        department_id: departmentId,
        admission_year,
        graduation_year,
        dob,
      },
      { transaction: t }
    );

    await t.commit();

    return NextResponse.json(
      { message: "Student added successfully", student: newStudent },
      { status: 201 }
    );
  } catch (error) {
    await t.rollback();
    console.error("Error adding Student:", error);
    return NextResponse.json(
      { error: "Failed to add Student" },
      { status: 500 }
    );
  }
}