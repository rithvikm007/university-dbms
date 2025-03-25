import Faculty from "@/models/Faculty";
import User from "@/models/User";
import { NextResponse } from "next/server"; 

export async function GET(req, context) { 
    try {
        const params = await context.params;
        const { id } = params;
        if (!id) {
            return NextResponse.json({ error: "Missing department ID" }, { status: 400 });
        }

        const faculties = await Faculty.findAll({
            where: { department_id: id },
            include: [{ model: User, attributes: ["user_id", "name", "email"] }],
        });
        return NextResponse.json({ faculties }, { status: 200 });
    } catch (error) {
        console.error("Error fetching faculties:", error);
        return NextResponse.json({ error: "Failed to fetch faculties" }, { status: 500 });
    }
}
