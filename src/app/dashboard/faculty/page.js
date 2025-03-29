"use client";

import Loading from "@/app/components/loading";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FacultyDashboard() {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const [scheduling, setScheduling] = useState({ courseId: null, date: "" });
    const router = useRouter();

    const handleTakeAttendance = (courseId) => {
        router.push(`/faculty/attendance/${courseId}`);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        const fetchAssignedCourses = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("/api/faculties/courses", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await response.json();
                if (response.ok) {
                    setCourses(data.courses);
                    setError("");
                    setSuccess("");
                } else {
                    setCourses([]);
                    setSuccess("");
                    setError(data.error || "Failed to fetch courses.");
                }
                setLoading(false);
            } catch (error) {
                setError("Something went wrong.");
                setSuccess("");
                console.error("Error fetching courses:", error);
                setLoading(false);
            }
        };

        fetchAssignedCourses();
    }, []);

    const handleScheduleClick = (courseId) => {
        setScheduling({ courseId, date: "" });
    };

    const handleScheduleSubmit = async () => {
        if (!scheduling.date) {
            setError("Please select a date.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/faculties/schedule-class", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    courseId: scheduling.courseId,
                    date: scheduling.date
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess("Class scheduled successfully!");
                setError("");
                setScheduling({ courseId: null, date: "" });
            } else {
                setError(data.error || "Failed to schedule class.");
                setSuccess("");
            }
        } catch (error) {
            setError("Something went wrong.");
            setSuccess("");
            console.error("Error scheduling class:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-center text-black mb-4">Faculty Dashboard</h2>
                <div>
                    <h3 className="text-lg font-semibold text-black mb-2">Assigned Courses</h3>
                    {loading && <Loading />}
                    {!loading && courses.length === 0 && <p className="text-center text-gray-500">No assigned courses found.</p>}
                    {!loading && courses.length > 0 && (
                        <ul className="space-y-4">
                            {courses.map((course) => (
                                <li key={course.course_id} className="p-4 bg-gray-200 text-black rounded-lg shadow">
                                    <h3 className="text-lg text-black font-semibold">{course.name}</h3>
                                    <p>Credits: {course.credits}</p>
                                    <p>Semester: {course.semester}</p>
                                    <button
                                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                        onClick={() => handleScheduleClick(course.course_id)}
                                    >
                                        Schedule Class
                                    </button>
                                    <button
                                        className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                                        onClick={() => handleTakeAttendance(course.course_id)}
                                    >
                                        Take Attendance
                                    </button>
                                    {scheduling.courseId === course.course_id && (
                                        <div className="mt-2">
                                            <input
                                                type="date"
                                                className="border p-2 rounded-md text-black"
                                                value={scheduling.date}
                                                onChange={(e) => setScheduling({ ...scheduling, date: e.target.value })}
                                            />
                                            <button
                                                className="ml-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
                                                onClick={handleScheduleSubmit}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {success && <p className="text-green-500 text-center">{success}</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}
            </div>
        </div>
    );
}
