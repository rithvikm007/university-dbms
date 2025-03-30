import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import ExamResult from "@/models/ExamResult";
import Course from "@/models/Course";
import Exam from "@/models/Exam";

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
    const id=Number(decoded.userId);

    const examResults = await ExamResult.findAll({
      where: { student_id: id },
      include: {
        model: Exam,
        attributes:["date","type","course_id"],
      },
        raw: true,
        nest: true,
    });
    // console.log(examResults);

    return NextResponse.json({ results: examResults }, { status: 200 });
  } catch (error) {
    console.error("Error fetching exam results:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
