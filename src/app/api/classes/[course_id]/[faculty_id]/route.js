import { NextResponse } from "next/server";
import Class from "@/models/Class";
import Course from "@/models/Course";
import Faculty from "@/models/Faculty";
import User from "@/models/User";
import Department from "@/models/Department";

export async function GET(req,context) {
    const params = await context.params;
  const { course_id, faculty_id } = params;

  try {
    if (!course_id || !faculty_id) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const foundClass = await Class.findOne({
      where: { course_id, faculty_id },
      include: [
        {
          model: Course,
          attributes: ["name"],
          include: {
            model: Department,
            attributes: ["name"],
          },
        },
        {
          model: Faculty,
          attributes: ["faculty_id"],
          include: {
            model: User,
            attributes: ["name", "email", "phone_no"],
          },
        },
      ],
    });

    if (!foundClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }
    // console.log(foundClass);
    return NextResponse.json(
      {
        course: {
          name: foundClass.Course.name,
          department: foundClass.Course.Department.name,
        },
        faculty: {
          id: foundClass.Faculty.faculty_id,
          name: foundClass.Faculty.User.name,
          email: foundClass.Faculty.User.email,
          phone_no: foundClass.Faculty.User.phone_no,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching class:", error);
    return NextResponse.json({ error: "Failed to fetch class" }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  const params = await context.params;
  const { course_id, faculty_id } = params;

  try {
    if (!course_id || !faculty_id) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const foundClass = await Class.findOne({ where: { course_id, faculty_id } });
    if (!foundClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    await foundClass.destroy();
    return NextResponse.json({ message: "Class deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting class:", error);
    return NextResponse.json({ error: "Failed to delete class" }, { status: 500 });
  }
}