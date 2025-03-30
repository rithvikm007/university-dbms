import { NextResponse } from "next/server";
import ExamResult from "@/models/ExamResult";
import { Op } from "sequelize";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const examId = searchParams.get("examId");
        
        if (!examId) {
            return NextResponse.json(
                { error: "Exam ID is required" },
                { status: 400 }
            );
        }

        const results = await ExamResult.findAll({
            where: { exam_id: examId },
        });

        return NextResponse.json(results, { status: 200 });
    } catch (error) {
        console.error("Error fetching exam results:", error);
        return NextResponse.json(
            { error: "Failed to fetch exam results." },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const { examId, results } = await req.json();

        const existingResults = await ExamResult.findAll({
            where: {
                exam_id: examId,
                student_id: { [Op.in]: Object.keys(results) },
            },
        });

        const existingMap = existingResults.reduce((acc, record) => {
            acc[record.student_id] = record;
            return acc;
        }, {});

        const newRecords = [];
        const updatePromises = [];

        Object.entries(results).forEach(([studentId, { marks, grade }]) => {
            if (existingMap[studentId]) {
                updatePromises.push(
                    existingMap[studentId].update({ marks, grade })
                );
            } else {
                newRecords.push({
                    student_id: studentId,
                    exam_id: examId,
                    marks,
                    grade,
                });
            }
        });

        if (newRecords.length > 0) {
            await ExamResult.bulkCreate(newRecords);
        }

        await Promise.all(updatePromises);

        return NextResponse.json(
            { message: "Exam results recorded successfully!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error recording exam results:", error);
        return NextResponse.json(
            { error: "Failed to record exam results." },
            { status: 500 }
        );
    }
}
