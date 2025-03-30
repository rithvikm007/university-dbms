import { NextResponse } from "next/server";
import db from "@/utils/db.js";
import Exam from "@/models/Exam";

export async function POST(req) {
    try {
        const { courseId, date, type } = await req.json();

        if (!courseId || !date || !type) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await Exam.create({ course_id: courseId, date, type });

        return NextResponse.json({ message: "Exam scheduled successfully!" }, { status: 200 });
    } catch (error) {
        console.error("Error scheduling exam:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
