"use client";

import Loading from "@/app/components/loading";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { FaUserPlus, FaChalkboardTeacher, FaBuilding, FaBook, FaSignOutAlt, FaTasks } from "react-icons/fa";

export default function FacultyDashboard() {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const [scheduling, setScheduling] = useState({ courseId: null, date: "" });
    const [examScheduling, setExamScheduling] = useState({ courseId: null, date: "", type: "" });
    const router = useRouter();
    const [id, setId] = useState(null);

    const handleTakeAttendance = (courseId) => {
        router.push(`/faculty/attendance/${courseId}`);
    };


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        const decodedToken = jwtDecode(token);
        setId(decodedToken.userId);
        const fetchAssignedCourses = async () => {
            try {
                const response = await fetch("/api/faculties/courses", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await response.json();
                if (response.ok) {
                    setCourses(data.courses);
                } else {
                    setError(data.error || "Failed to fetch courses.");
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
                setError("Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchAssignedCourses();
    }, []);

    const handleScheduleClassClick = (courseId) => {
        setScheduling({ courseId, date: "" });
        setExamScheduling({ courseId: null, date: "", type: "" });
    };

    const handleScheduleExamClick = (courseId) => {
        setExamScheduling({ courseId, date: "", type: "" });
        setScheduling({ courseId: null, date: "" });
    };

    const handleScheduleClassSubmit = async () => {
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
                setScheduling({ courseId: null, date: "" });
            } else {
                setError(data.error || "Failed to schedule class.");
            }
        } catch (error) {
            console.error("Error scheduling class:", error);
            setError("Something went wrong.");
        }
    };

    const handleScheduleExamSubmit = async () => {
        if (!examScheduling.date || !examScheduling.type) {
            setError("Please select a date and exam type.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/faculties/schedule-exam", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    courseId: examScheduling.courseId,
                    date: examScheduling.date,
                    type: examScheduling.type
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess("Exam scheduled successfully!");
                setExamScheduling({ courseId: null, date: "", type: "" });
            } else {
                setError(data.error || "Failed to schedule exam.");
            }
        } catch (error) {
            console.error("Error scheduling exam:", error);
            setError("Something went wrong.");
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
                                        className="mt-2 bg-blue-500 mr-1 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                        onClick={() => router.push(`/classes/${course.course_id}/${id}`)}
                                    >
                                        View Detials
                                    </button>
                                    <button
                                        className="mt-2 bg-blue-500 mr-1 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                        onClick={() => handleScheduleClassClick(course.course_id)}
                                    >
                                        Schedule Class
                                    </button>
                                    <button
                                        className="mt-2 bg-blue-500 mx-1 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                        onClick={() => handleScheduleExamClick(course.course_id)}
                                    >
                                        Schedule Exam
                                    </button>

                                    <button
                                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                        onClick={() => handleTakeAttendance(course.course_id)}
                                    >
                                        Take Attendance
                                    </button>
                                    <button
                                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                        onClick={() => router.push(`/faculty/exam-results/${course.course_id}`)}
                                    >
                                        Record Exam Results
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
                                                onClick={handleScheduleClassSubmit}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    )}
                                    {examScheduling.courseId === course.course_id && (
                                        <div className="mt-2">
                                            <input
                                                type="date"
                                                className="border p-2 rounded-md text-black"
                                                value={examScheduling.date}
                                                onChange={(e) => setExamScheduling({ ...examScheduling, date: e.target.value })}
                                            />
                                            <select
                                                className="border p-2 rounded-md text-black ml-2"
                                                value={examScheduling.type}
                                                onChange={(e) => setExamScheduling({ ...examScheduling, type: e.target.value })}
                                            >
                                                <option value="">Select Exam Type</option>
                                                <option value="Midterm">Midterm</option>
                                                <option value="Final">Final</option>
                                                <option value="Quiz">Quiz</option>
                                            </select>
                                            <button
                                                className="ml-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700"
                                                onClick={handleScheduleExamSubmit}
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
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        router.push("/login");
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 mt-6"
                >
                    <FaSignOutAlt /> Log Out
                </button>
                {success && <p className="text-green-500 text-center mt-2">{success}</p>}
                {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            </div>
        </div>
    );
}
