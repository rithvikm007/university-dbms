import Course from "@/models/Course";
import { NextResponse } from "next/server";

export async function GET(req, context) { 
    try {
        const params = await context.params;
        const { id } = params;
        
        if (!id) {
            return NextResponse.json({ error: "Missing department ID" }, { status: 400 });
        }

        const courses = await Course.findAll({
            where: { department_id: id },
            attributes: ["course_id", "name", "credits", "semester"],
        });

        return NextResponse.json({ courses }, { status: 200 });
    } catch (error) {
        console.error("Error fetching courses:", error);
        return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
    }
}
