import Attendance from "@/models/Attendance";

export async function POST(req) {
    try {
        const { courseId, date, attendance } = await req.json();

        if (!courseId || !date || !attendance) {
            return Response.json({ error: "Missing required fields." }, { status: 400 });
        }

        const attendanceRecords = Object.entries(attendance).map(([student_id, status]) => ({
            student_id,
            course_id: courseId,
            date,
            status,
        }));

        await Attendance.bulkCreate(attendanceRecords, {
            updateOnDuplicate: ["status"],
        });

        return Response.json({ message: "Attendance submitted successfully!" }, { status: 200 });
    } catch (error) {
        console.error("Error submitting attendance:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
