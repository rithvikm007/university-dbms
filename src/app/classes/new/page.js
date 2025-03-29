"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/loading";

export default function AssignCourse() {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [courses, setCourses] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                const coursesResponse = await fetch("/api/courses", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const facultiesResponse = await fetch("/api/faculties", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const departmentsResponse = await fetch("/api/departments", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const departmentsData = await departmentsResponse.json();
                const coursesData = await coursesResponse.json();
                const facultiesData = await facultiesResponse.json();


                if (coursesResponse.ok && facultiesResponse.ok && departmentsResponse.ok) {
                    setCourses(coursesData.courses || []);
                    setFaculties(facultiesData.faculty || []);
                    setDepartments(departmentsData.departments || []);
                    setError("");
                    setLoading(false);
                } else {
                    setError("Failed to load data.");
                }
            } catch (error) {
                setError("Something went wrong while fetching data.");
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const classData = {
            course_id: parseInt(event.target.courseId.value, 10),
            faculty_id: parseInt(event.target.facultyId.value, 10),
        };

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/classes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(classData),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess("Course assigned successfully!");
                setError("");
                setTimeout(() => {
                    router.push("/classes");
                }, 1000);
            } else {
                setError(data.error || "Something went wrong.");
            }
        } catch (error) {
            setError("Something went wrong. Please try again.");
            console.error("Error:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                {loading && <Loading />}
                {!loading && (
                    <>
                        <h2 className="text-2xl font-bold mb-6 text-center text-black">Assign Course</h2>
                        <form onSubmit={handleSubmit}>
                            {/* Department Selection */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700" htmlFor="departmentId">
                                    Department<span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="departmentId"
                                    name="departmentId"
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                    required
                                    className="mt-1 block w-full px-4 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="">Select a department</option>
                                    {departments.map((department) => (
                                        <option key={department.department_id} value={department.department_id}>
                                            {department.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Course Selection */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700" htmlFor="courseId">
                                    Course<span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="courseId"
                                    name="courseId"
                                    required
                                    className="mt-1 block w-full px-4 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="">Select a course</option>
                                    {courses
                                        .filter((course) => course.department_id === parseInt(selectedDepartment, 10))
                                        .map((course) => (
                                            <option key={course.course_id} value={course.course_id}>
                                                {course.name}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            {/* Faculty Selection */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700" htmlFor="facultyId">
                                    Faculty<span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="facultyId"
                                    name="facultyId"
                                    required
                                    className="mt-1 block w-full px-4 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="">Select a faculty</option>
                                    {faculties
                                        .filter((faculty) => faculty.department_id === parseInt(selectedDepartment, 10))
                                        .map((member) => (
                                            <option key={member.faculty_id} value={member.faculty_id}>
                                                {member.name}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                            >
                                Assign Course
                            </button>
                        </form>
                        <button
                            onClick={() => router.back()}
                            className="w-full mt-2 py-2 px-4 bg-blue-500 text-md text-white font-semibold rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 mb-4"
                        >
                            Go Back
                        </button>
                        {/* Display success or error message */}
                        {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
                        {success && <div className="mt-4 text-green-500 text-sm">{success}</div>}
                    </>
                )}
            </div>
        </div>
    );
}
