import { NextResponse } from "next/server";
import Course from "@/models/Course";
import Department from "@/models/Department";

export async function GET() {
  try {
    const courses = await Course.findAll({
      attributes: ["course_id", "name", "credits", "semester", "department_id"],
      include: [
        {
          model: Department,
          attributes: ["name"], 
        },
      ],
      order: [["course_id", "ASC"]],
    });

    return NextResponse.json({ courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, credits, semester, department_id } = await req.json();

    // Validate input
    if (!name || !credits || !semester || !department_id) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Create new course
    const newCourse = await Course.create({
      name,
      credits,
      semester,
      department_id,
    });

    return NextResponse.json(
      { message: "Course added successfully", course: newCourse },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding course:", error);
    return NextResponse.json(
      { error: "Failed to add course" },
      { status: 500 }
    );
  }
}