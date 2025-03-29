import Student from "@/models/Student";
import User from "@/models/User";
import { NextResponse } from "next/server"; 

export async function GET(req, context) { 
    try {
        const params = await context.params;
        const { id } = params;
        if (!id) {
            return NextResponse.json({ error: "Missing department ID" }, { status: 400 });
        }

        const students = await Student.findAll({
            where: { department_id: id },
            include: [{ model: User, attributes: ["user_id", "name", "email"] }],
        });
        return NextResponse.json({ students }, { status: 200 });
    } catch (error) {
        console.error("Error fetching students:", error);
        return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
    }
}
