import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Enrollment from "@/models/Enrollment";
import Attendance from "@/models/Attendance";

const SECRET_KEY = process.env.JWT_SECRET;

export async function POST(req) {
    try {
        const authHeader = await req.headers.get("authorization");
        const token = authHeader?.split(" ")[1];

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let user;
        try {
            user = jwt.verify(token, SECRET_KEY);
        } catch (err) {
            console.error("Error verifying token:", err);
            return NextResponse.json({ error: "Invalid token" }, { status: 403 });
        }

        if (user.userType !== "faculty") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { courseId, date } = await req.json();

        if (!courseId || !date) {
            return NextResponse.json({ error: "Missing courseId or date" }, { status: 400 });
        }

        const enrolledStudents = await Enrollment.findAll({
            where: { course_id: courseId },
        });

        if (enrolledStudents.length === 0) {
            return NextResponse.json({ message: "No students enrolled in this course." }, { status: 200 });
        }

        const newRecords = enrolledStudents.map(student => ({
            student_id: student.student_id,
            course_id: courseId,
            date,
            status: "Absent",
        }));

        await Attendance.bulkCreate(newRecords, {
            ignoreDuplicates: true,
        });

        return NextResponse.json({ 
            message: "Class scheduled. Attendance records updated."
        }, { status: 201 });

    } catch (error) {
        console.error("Error scheduling class:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
