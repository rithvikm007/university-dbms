import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Attendance from "@/models/Attendance";
import Course from "@/models/Course";

export async function GET(req) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 403 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.userId || decoded.userType !== "student") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const id = Number(decoded.userId);
    const attendanceRecords = await Attendance.findAll({
      where: { student_id: id },
      include: {
        model: Course,
        attributes: ["name", "course_id"],
      },
      raw: true,
      nest: true,
    });

    // console.log(attendanceRecords);

    return NextResponse.json({ attendance: attendanceRecords }, { status: 200 });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
