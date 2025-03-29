import { NextResponse } from "next/server";
import Class from "@/models/Class";
import Course from "@/models/Course";
import Faculty from "@/models/Faculty";
import User from "@/models/User";

// GET: Fetch all classes with course name & faculty name
export async function GET() {
  try {
    const classes = await Class.findAll({
      include: [
        {
          model: Course,
          attributes: ["course_id", "name","department_id"],
        },
        {
          model: Faculty,
          include: [
            {
              model: User,
              attributes: ["name"],
            },
          ],
        },
      ],
      order: [["course_id", "ASC"], ["faculty_id", "ASC"]],
    });

    const classData = classes.map((cls) => ({
      course_id: cls.course_id,
      course_name: cls.Course?.name || "Unknown",
      faculty_id: cls.faculty_id,
      faculty_name: cls.Faculty?.User?.name || "Unknown",
    }));

    return NextResponse.json({ classes: classData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 }
    );
  }
}

// POST: Add a new class
export async function POST(req) {
  try {
    const { course_id, faculty_id } = await req.json();

    if (!course_id || !faculty_id) {
      return NextResponse.json(
        { error: "course_id and faculty_id are required" },
        { status: 400 }
      );
    }

    const existingClass = await Class.findOne({
      where: { course_id, faculty_id },
    });

    if (existingClass) {
      return NextResponse.json(
        { error: "Class assignment already exists" },
        { status: 409 }
      );
    }

    const newClass = await Class.create({
      course_id,
      faculty_id,
    });

    return NextResponse.json(
      { message: "Class assigned successfully", class: newClass },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error assigning class:", error);
    return NextResponse.json(
      { error: "Failed to assign class" },
      { status: 500 }
    );
  }
}
