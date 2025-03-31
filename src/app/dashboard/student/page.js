"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/loading";
import { jwtDecode } from "jwt-decode";
import { FaUserPlus, FaChalkboardTeacher, FaBuilding, FaBook, FaSignOutAlt, FaTasks } from "react-icons/fa";

export default function StudentDashboard() {
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [results, setResults] = useState({});
    const [expandedSections, setExpandedSections] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadingCourses, setLoadingCourses] = useState({});

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        const decodedToken = jwtDecode(token);
        if (decodedToken.userType !== "student") {
            router.back();
            return;
        }

        const fetchData = async () => {
            try {
                const [coursesRes, enrolledRes] = await Promise.all([
                    fetch("/api/courses", { headers: { Authorization: `Bearer ${token}` } }),
                    fetch("/api/students/enrolled-courses", { headers: { Authorization: `Bearer ${token}` } })
                ]);

                if (!coursesRes.ok || !enrolledRes.ok) {
                    throw new Error("Failed to fetch courses or enrolled data.");
                }

                const coursesData = await coursesRes.json();
                const enrolledData = await enrolledRes.json();

                setCourses(coursesData.courses);
                const enrolledIds = enrolledData.courses.map(c => c.course_id);
                setEnrolledCourses(enrolledIds);

                const attendanceData = {};
                const resultsData = {};

                await Promise.all(enrolledIds.map(async (id) => {
                    const [attRes, resRes] = await Promise.all([
                        fetch(`/api/students/${id}/attendance`, { headers: { Authorization: `Bearer ${token}` } }),
                        fetch(`/api/students/${id}/results`, { headers: { Authorization: `Bearer ${token}` } })
                    ]);

                    if (attRes.ok) {
                        const attData = await attRes.json();
                        attendanceData[id] = attData.attendance || [];
                        // console.log("Rendering StudentDashboard");
                        // console.log(attendanceData);
                    }
                    if (resRes.ok) {
                        const resData = await resRes.json();
                        console.log("Fetched results data:", resData);

                        if (resData && resData.results) {
                            resData.results.forEach((result) => {
                                const courseId = result.Exam.course_id;

                                // Initialize course results only if not set
                                if (!resultsData[courseId]) {
                                    resultsData[courseId] = [];
                                }

                                // Avoid duplicate entries
                                if (!resultsData[courseId].some(r => r.exam_id === result.exam_id)) {
                                    resultsData[courseId].push(result);
                                }
                            });
                        }

                        console.log("Updated resultsData:", resultsData);
                    }
                }));

                setAttendance(attendanceData);
                setResults(resultsData);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const toggleSection = (courseId) => {
        setExpandedSections(prev => ({
            ...prev,
            [courseId]: !prev[courseId]
        }));
    };

    const enrollInCourse = async (courseId) => {
        setLoadingCourses((prev) => ({ ...prev, [courseId]: true }));
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/enroll", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ courseId }),
            });
            const data = await response.json();

            if (response.ok) {
                setEnrolledCourses([...enrolledCourses, courseId]);
            } else {
                setError(data.error || "Enrollment failed.");
            }
        } catch (error) {
            setError("Something went wrong.");
            console.error("Error enrolling in course:", error);
        } finally {
            setLoadingCourses((prev) => ({ ...prev, [courseId]: false }));
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
                <h2 className="text-2xl font-bold text-center text-black mb-4">Student Dashboard</h2>
                {loading && <Loading />}
                {error && <p className="text-red-500 text-center">{error}</p>}
                {!loading && !error && (
                    <div>
                        <h3 className="text-lg font-semibold text-black mb-2">Enrolled Courses</h3>
                        {enrolledCourses.length === 0 ? (
                            <p className="text-center text-gray-500">You haven't enrolled in any courses yet.</p>
                        ) : (
                            <ul className="space-y-4">
                                {courses.filter(course => enrolledCourses.includes(course.course_id)).map((course) => (
                                    <li key={course.course_id} className="p-4 bg-green-200 text-black rounded-lg shadow">
                                        <h3 className="text-lg font-semibold">{course.name}</h3>
                                        <p>Credits: {course.credits}</p>
                                        <p>Semester: {course.semester}</p>
                                        <button
                                            onClick={() => toggleSection(course.course_id)}
                                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                        >
                                            {expandedSections[course.course_id] ? "Hide Details" : "View Details"}
                                        </button>
                                        {expandedSections[course.course_id] && (
                                            <div>
                                                {/* Attendance Section */}
                                                <div className="mt-4 p-2 bg-gray-100 rounded">
                                                    <h4 className="text-md font-semibold">Attendance</h4>
                                                    {Object.values(attendance)
                                                        .flat()
                                                        .filter((record, index, self) =>
                                                            record.course_id === course.course_id &&
                                                            index === self.findIndex((r) => r.course_id === record.course_id && r.date === record.date)
                                                        ).length ? (
                                                        <ul className="list-disc pl-4">
                                                            {Object.values(attendance)
                                                                .flat()
                                                                .filter((record, index, self) =>
                                                                    record.course_id === course.course_id &&
                                                                    index === self.findIndex((r) => r.course_id === record.course_id && r.date === record.date)
                                                                )
                                                                .map((record, index) => (
                                                                    <li key={index}>{record.date}: {record.status}</li>
                                                                ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-gray-600">No attendance records available.</p>
                                                    )}

                                                </div>

                                                {/* Exam Results Section */}
                                                <div className="mt-4 p-2 bg-gray-100 rounded">
                                                    <h4 className="text-md font-semibold">Exam Results</h4>
                                                    {results[course.course_id]?.length ? (
                                                        <ul className="list-disc pl-4">
                                                            {results[course.course_id].map((exam, index) => (
                                                                <li key={index}>
                                                                    {exam.Exam.type} ({exam.Exam.date}):  Marks - {exam.marks} Grade- {exam.grade}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p className="text-gray-600">No results available.</p>
                                                    )}
                                                </div>

                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>

                        )}
                        {/* Available Courses */}
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-black mb-2">Available Courses</h3>
                            {courses.filter(course => !enrolledCourses.includes(course.course_id)).length === 0 ? (
                                <p className="text-center text-gray-500">No available courses to enroll in.</p>
                            ) : (
                                <ul className="space-y-4">
                                    {courses
                                        .filter(course => !enrolledCourses.includes(course.course_id))
                                        .map((course) => (
                                            <li key={course.course_id} className="p-4 bg-gray-200 text-black rounded-lg shadow flex justify-between items-center">
                                                <div>
                                                    <h3 className="text-lg text-black font-semibold">{course.name}</h3>
                                                    <p>Credits: {course.credits}</p>
                                                    <p>Semester: {course.semester}</p>
                                                </div>
                                                <button
                                                    onClick={() => enrollInCourse(course.course_id)}
                                                    disabled={loadingCourses[course.course_id]}
                                                    className={`px-4 py-2 rounded-lg text-white transition ${loadingCourses[course.course_id]
                                                            ? "bg-gray-400 cursor-not-allowed"
                                                            : "bg-blue-500 hover:bg-blue-600"
                                                        }`}
                                                >
                                                    {loadingCourses[course.course_id] ? "Enrolling..." : "Enroll"}
                                                </button>
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        router.push("/login");
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 mt-6"
                >
                    <FaSignOutAlt /> Log Out
                </button>
            </div>
        </div>
    );
}
