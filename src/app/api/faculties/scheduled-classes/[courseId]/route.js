import { NextResponse } from "next/server";
import Class from "@/models/Class";
import Course from "@/models/Course";
import Faculty from "@/models/Faculty";
import jwt from "jsonwebtoken";
import Attendance from "@/models/Attendance";
import Student from "@/models/Student";
import User from "@/models/User";

export async function GET(req, context) {
    try {
        const params = await context.params;
        const authHeader = await req.headers.get("authorization");
        const token = authHeader?.split(" ")[1];
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        const faculty = await Faculty.findByPk(decoded.userId);

        if (!faculty) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { courseId } = params;

        const assignedCourse = await Class.findOne({
            where: { course_id: courseId, faculty_id: faculty.faculty_id },
        });

        if (!assignedCourse) {
            return NextResponse.json({ error: "You are not assigned to this course." }, { status: 403 });
        }

        const sessions = await Attendance.findAll({
            where: { course_id: courseId },
            include:[
                {
                    model: Student,
                    attributes: ['student_id'],
                    include: {
                        model: User,
                        attributes: ['name']
                    }
                }
            ],
            order: [["date", "ASC"]],
        });
        // console.log("Sessions:", sessions);
        return NextResponse.json({ sessions }, { status: 200 });
    } catch (error) {
        console.error("Error fetching scheduled classes:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
