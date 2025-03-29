"use client";

import { useEffect, useState } from "react";
import Loading from "@/app/components/loading";

export default function StudentDashboard() {
    const [courses, setCourses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                const coursesResponse = await fetch("/api/courses", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const coursesData = await coursesResponse.json();

                const enrolledResponse = await fetch("/api/students/enrolled-courses", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const enrolledData = await enrolledResponse.json();

                if (coursesResponse.ok && enrolledResponse.ok) {
                    setCourses(coursesData.courses);
                    setEnrolledCourses(enrolledData.courses.map(c => c.course_id));
                } else {
                    setError("Failed to fetch courses.");
                }
            } catch (error) {
                setError("Something went wrong.");
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const enrollInCourse = async (courseId) => {
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
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
                <h2 className="text-2xl font-bold text-center text-black mb-4">Student Dashboard</h2>

                {loading && <Loading />}
                {error && <p className="text-red-500 text-center">{error}</p>}

                {/* Enrolled Courses */}
                {!loading && !error && (<>
                <div>
                    <h3 className="text-lg font-semibold text-black mb-2">Enrolled Courses</h3>
                    {enrolledCourses.length === 0 ? (
                        <p className="text-center text-gray-500">You haven't enrolled in any courses yet.</p>
                    ) : (
                        <ul className="space-y-4">
                            {courses
                                .filter(course => enrolledCourses.includes(course.course_id))
                                .map((course) => (
                                    <li key={course.course_id} className="p-4 bg-green-200 text-black rounded-lg shadow">
                                        <h3 className="text-lg text-black font-semibold">{course.name}</h3>
                                        <p>Credits: {course.credits}</p>
                                        <p>Semester: {course.semester}</p>
                                    </li>
                                ))}
                        </ul>
                    )}
                </div>

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
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                            Enroll
                                        </button>
                                    </li>
                                ))}
                        </ul>
                    )}
                </div>
                </>)}
            </div>
        </div>
    );
}
