import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Class from "@/models/Class"; 
import Course from "@/models/Course";

export async function GET(req) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 403 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.userType !== "faculty") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const facultyClasses = await Class.findAll({
      where: { faculty_id: decoded.userId },
      attributes: ["course_id"], 
    });

    if (facultyClasses.length === 0) {
      return NextResponse.json({ courses: [] }, { status: 200 });
    }

    const courseIds = facultyClasses.map((cls) => cls.course_id);

    const courses = await Course.findAll({
      where: { course_id: courseIds },
      attributes: ["course_id", "name", "credits", "semester"],
    });

    return NextResponse.json({ courses }, { status: 200 });
  } catch (error) {
    console.error("Error fetching faculty courses:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
