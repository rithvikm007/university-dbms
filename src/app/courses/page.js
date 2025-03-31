"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/loading";

export default function Courses() {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, courseRes] = await Promise.all([
          fetch("/api/departments"),
          fetch("/api/courses"),
        ]);

        const [deptData, courseData] = await Promise.all([
          deptRes.json(),
          courseRes.json(),
        ]);

        if (deptRes.ok && courseRes.ok) {
          setDepartments(deptData.departments);
          setCourses(courseData.courses);
        } else {
          setError("Failed to load data.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Organizing courses under their respective departments
  const departmentCoursesMap = departments.reduce((acc, dept) => {
    acc[dept.department_id] = {
      name: dept.name,
      courses: [],
    };
    return acc;
  }, {});

  courses.forEach((course) => {
    if (course.department_id && departmentCoursesMap[course.department_id]) {
      departmentCoursesMap[course.department_id].courses.push(course);
    }
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-black text-center">Courses by Department</h2>

        {/* Loading State */}
        {loading && <Loading />}

        {/* Error State */}
        {!loading && error && <p className="text-red-500 text-center">{error}</p>}

        {/* Department & Courses List */}
        {!loading && !error && (
          <>
            {departments.length === 0 ? (
              <p className="text-gray-600 text-center">No departments available.</p>
            ) : (
              <ul>
                {departments.map((dept) => (
                  <li key={dept.department_id} className="mb-4">
                    <h3 className="text-lg font-semibold text-black">{dept.name}</h3>
                    {departmentCoursesMap[dept.department_id].courses.length > 0 ? (
                      <ul className="mt-2">
                        {departmentCoursesMap[dept.department_id].courses.map((course) => (
                          <li
                            key={course.course_id}
                            className="py-2 px-4 text-black bg-gray-200 rounded-md mb-2 cursor-pointer hover:bg-gray-300"
                            onClick={() => router.push(`/courses/${course.course_id}`)}
                          >
                            {course.name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600">No courses in this department.</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => router.back()}
              className="w-full py-2 px-4 bg-blue-500 text-md text-white font-semibold rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 mb-4"
            >
              Go Back
            </button>
          </>
        )}

        {/* Admin-only button */}
        {typeof window !== "undefined" && localStorage.getItem("userType") === "admin" && (
          <button
            onClick={() => router.push("/courses/new")}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mt-4"
          >
            Add Course
          </button>
        )}
        
      </div>
    </div>
  );
}
