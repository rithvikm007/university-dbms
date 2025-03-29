import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Course from "@/models/Course";
import { headers } from "next/headers";
import Enrollment from "@/models/Enrollment";
import Student from "@/models/Student";

const SECRET_KEY = process.env.JWT_SECRET;

export async function GET(req) {
    try {
          
        const authHeader = await req.headers.get("authorization");
        const token = authHeader?.split(" ")[1];

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let user;
        try {
            user = jwt.verify(token, SECRET_KEY);
            // console.log(user);
        } catch (err) {
            console.error("Error verifying token:", err);
            return NextResponse.json({ error: "Invalid token" }, { status: 403 });
        }

        if (user.userType !== "student") {
            console.error("User is not a student");
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const enrolledCourses = await Enrollment.findAll({
            where: { student_id: user.userId },
            include: [{ model: Course, attributes: ["course_id", "name", "credits", "semester"] }],
        });
        // console.log(enrolledCourses);

        return NextResponse.json({ courses: enrolledCourses.map(enroll => enroll.Course) }, { status: 200 });

    } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
