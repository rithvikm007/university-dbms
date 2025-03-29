import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Enrollment from "@/models/Enrollment";
import Attendance from "@/models/Attendance";
import { Op } from "sequelize";

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

        // Fetch all students enrolled in this course
        const enrolledStudents = await Enrollment.findAll({
            where: { course_id: courseId },
        });

        if (enrolledStudents.length === 0) {
            return NextResponse.json({ message: "No students enrolled in this course." }, { status: 200 });
        }

        // Check for existing attendance records
        const existingRecords = await Attendance.findAll({
            where: {
                course_id: courseId,
                date: date,
                student_id: { [Op.in]: enrolledStudents.map(s => s.student_id) }
            }
        });

        const existingStudentIds = existingRecords.map(record => record.student_id);

        // Insert only new attendance records
        const newRecords = enrolledStudents
            .filter(student => !existingStudentIds.includes(student.student_id))
            .map(student => ({
                student_id: student.student_id,
                course_id: courseId,
                date,
                status: "Absent",
            }));

        if (newRecords.length > 0) {
            await Attendance.bulkCreate(newRecords);
        }

        return NextResponse.json({ 
            message: "Class scheduled. Attendance records updated.", 
            addedRecords: newRecords.length 
        }, { status: 201 });

    } catch (error) {
        console.error("Error scheduling class:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
