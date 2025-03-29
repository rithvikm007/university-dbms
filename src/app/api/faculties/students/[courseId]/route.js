import Student from "@/models/Student";
import Enrollment from "@/models/Enrollment";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req, context) {
    try {
        const params = await context.params;
        const { courseId } = params;

        if (!courseId) {
            return NextResponse.json({ error: "Course ID is required." }, { status: 400 });
        }

        const students = await Enrollment.findAll({
            where: { course_id: courseId },
            include: [
                {
                    model: Student,
                    include: [{ model: User, attributes: ["user_id", "name", "email"] }],
                },
            ],
        });

        const studentList = students.map((enrollment) => ({
            id: enrollment.Student.User.user_id,
            name: enrollment.Student.User.name,
            email: enrollment.Student.User.email,
        }));

        return NextResponse.json({ students: studentList }, { status: 200 });
    } catch (error) {
        console.error("Error fetching students:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
