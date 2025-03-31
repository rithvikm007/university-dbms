"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Loading from "@/app/components/loading";

export default function AttendancePage() {
    const router = useRouter();
    const { courseId } = useParams();
    const [sessions, setSessions] = useState([]);
    const [expandedSession, setExpandedSession] = useState(null);
    const [students, setStudents] = useState({});
    const [attendance, setAttendance] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchScheduledSessions = async () => {
            try {
                const response = await fetch(`/api/faculties/scheduled-classes/${courseId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await response.json();
                if (response.ok) {
                    setSessions(data.sessions);
                } else {
                    setError(data.error || "Failed to fetch scheduled sessions.");
                }
                setLoading(false);
            } catch (error) {
                setError("Something went wrong.");
                console.error("Error fetching scheduled sessions:", error);
                setLoading(false);
            }
        };

        fetchScheduledSessions();
    }, [courseId]);

    const toggleSession = async (date) => {
        if (expandedSession === date) {
            setExpandedSession(null);
            return;
        }

        setExpandedSession(date);

        if (!students[date]) {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`/api/faculties/students/${courseId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await response.json();
                if (response.ok) {
                    setStudents((prev) => ({ ...prev, [date]: data.students }));
                    setAttendance((prev) => ({
                        ...prev,
                        [date]: data.students.reduce((acc, student) => {
                            acc[student.id] = "Present";
                            return acc;
                        }, {}),
                    }));
                } else {
                    console.error("Error fetching students:", data.error);
                }
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        }
    };

    const handleAttendanceChange = (date, studentId, status) => {
        setAttendance((prev) => ({
            ...prev,
            [date]: { ...prev[date], [studentId]: status },
        }));
    };

    const submitAttendance = async (date) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`/api/faculties/attendance/mark`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    courseId,
                    date,
                    attendance: attendance[date],
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess("Attendance submitted successfully!");
                setError("");
                setExpandedSession(null);
            } else {
                console.error("Error submitting attendance:", data.error);
                setError(data.error || "Failed to submit attendance.");
                setSuccess("");
            }
        } catch (error) {
            console.error("Error submitting attendance:", error);
            setError("Something went wrong.");
            setSuccess("");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-center text-black mb-4">Scheduled Sessions</h2>
                {loading && <Loading />}
                {error && <p className="text-red-500 text-center">{error}</p>}
                {!loading && sessions.length === 0 && <p className="text-center text-gray-500">No scheduled sessions found.</p>}
                {!loading && sessions.length > 0 && (
                    <ul className="space-y-4">
                        {sessions.map((session) => (
                            <li key={session.date} className="p-4 bg-gray-200 text-black rounded-lg shadow">
                                <p className="text-lg font-semibold">Date: {session.date}</p>
                                <button
                                    className="mt-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
                                    onClick={() => toggleSession(session.date)}
                                >
                                    {expandedSession === session.date ? "Hide Students" : "Mark Attendance"}
                                </button>

                                {expandedSession === session.date && (
                                    <div className="mt-4">
                                        {students[session.date] ? (
                                            <>
                                                <ul className="space-y-2">
                                                    {students[session.date].map((student) => (
                                                        <li key={student.id} className="flex justify-between items-center bg-white p-2 rounded-md shadow">
                                                            <p className="text-black">{student.name}</p>
                                                            <select
                                                                className="border p-2 rounded-md text-black"
                                                                value={attendance[session.date][student.id]}
                                                                onChange={(e) => handleAttendanceChange(session.date, student.id, e.target.value)}
                                                            >
                                                                <option value="Present">Present</option>
                                                                <option value="Absent">Absent</option>
                                                                <option value="Late">Late</option>
                                                            </select>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <button
                                                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                                    onClick={() => submitAttendance(session.date)}
                                                >
                                                    Submit Attendance
                                                </button>
                                                {success && <p className="text-green-500 mt-2">{success}</p>}
                                                {error && <p className="text-red-500 mt-2">{error}</p>}
                                            </>
                                        ) : (
                                            <Loading />
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
                <button
                    onClick={() => router.back()}
                    className="w-full mt-2 py-2 px-4 bg-blue-500 text-md text-white font-semibold rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 mb-4"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
}
