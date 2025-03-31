import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Enrollment from "@/models/Enrollment";
import Course from "@/models/Course";
import Student from "@/models/Student";

export async function POST(req) {
    try {
        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) {
            return NextResponse.json({ error: "No token provided" }, { status: 403 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.userType !== "student") {
            return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        }
        const studentExists = await Student.findByPk(decoded.userId);
        if (!studentExists) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        const { courseId } = await req.json();
        if (!courseId) {
            return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
        }

        const course = await Course.findByPk(courseId);
        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        const existingEnrollment = await Enrollment.findOne({
            where: { student_id: decoded.userId, course_id: courseId },
        });
        if (existingEnrollment) {
            return NextResponse.json({ error: "Already enrolled in this course" }, { status: 400 });
        }

        await Enrollment.create({ student_id: decoded.userId, course_id: courseId });
        return NextResponse.json({ message: "Enrollment successful" }, { status: 201 });
    } catch (error) {
        console.error("Error enrolling in course:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
