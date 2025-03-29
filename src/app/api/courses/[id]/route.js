import { NextResponse } from "next/server";
import Course from "@/models/Course";
import Department from "@/models/Department";
import sequelize from "@/utils/db";

// Fetch a course
export async function GET(req, context) {
  try {
    const params = await context.params;
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Missing course ID" }, { status: 400 });
    }

    const course = await Course.findByPk(id, {
      include: [{ model: Department, attributes: ["name"] }],
    });
    // console.log(course);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ course }, { status: 200 });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json({ error: "Failed to fetch course" }, { status: 500 });
  }
}

// Update a course
export async function PUT(req, context) {
  const transaction = await sequelize.transaction();
  try {
    const params = await context.params;
    const { id } = params;
    const { name, credits, semester, department_id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing course ID" }, { status: 400 });
    }

    const course = await Course.findByPk(id, { transaction });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    await course.update(
      { name, credits, semester, department_id },
      { transaction }
    );

    await transaction.commit();
    return NextResponse.json({ message: "Course updated successfully", course }, { status: 200 });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating course:", error);
    return NextResponse.json({ error: "Failed to update course" }, { status: 500 });
  }
}

// Remove a course
export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Missing course ID" }, { status: 400 });
    }

    const course = await Course.findByPk(id);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    await course.destroy();
    return NextResponse.json({ message: "Course deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
