import Exam from "@/models/Exam";
import { NextResponse } from "next/server";

export async function GET(req, context) {
    const params = await context.params;
    const { courseId } = params;

    try {
        const exams = await Exam.findAll({ where: { course_id: courseId } });

        return NextResponse.json({ exams }, { status: 200 });
    } catch (error) {
        console.error("Error fetching exams:", error);
        return NextResponse.json({ error: "Failed to fetch scheduled exams." }, { status: 500 });
    }
}
