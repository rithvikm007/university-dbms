import { NextResponse } from "next/server";
import Student from "@/models/Student";
import User from "@/models/User";
import Department from "@/models/Department";

// Fetch a specific student
export async function GET(req, context) {
  try {
    const params = await context.params;
    if (!params?.id) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const student = await Student.findByPk(params.id, {
      include: [
        {
          model: User,
          attributes: ["name", "email", "phone_no"],
        },
      ],
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(
      { 
        student: {
            id: student.student_id,
            name: student.User.name,
            email: student.User.email,
            phone_no: student.User.phone_no,
            dob: student.dob,
            admission_year: student.admission_year,
            graduation_year: student.graduation_year,
            department_id: student.department_id,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 });
  }
}


// Update a Student
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { name,graduation_year, phone_no, email,admission_year,department_id } = await req.json();

    const student = await Student.findByPk(id);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    const user = await User.findByPk(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 }); 
    }
    await user.update({ name, email, phone_no });
    await student.update({ admission_year, graduation_year, department_id });
    
    return NextResponse.json({ message: "Faculty updated successfully", student }, { status: 200 });
  } catch (error) {
    console.error("Error updating faculty:", error);
    return NextResponse.json({ error: "Failed to update faculty" }, { status: 500 });
  }
}

// Remove a Student
export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const { id } = params;
    const student = await Student.findByPk(id);

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    await student.destroy();
    return NextResponse.json({ message: "Student deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
  }
}

