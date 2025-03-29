"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Loading from "@/app/components/loading";

export default function ViewCourse() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [department, setDepartment] = useState(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${id}`);
        const data = await response.json();

        if (response.ok) {
          setCourse(data.course);
          setDepartment(data.department);
        } else {
          setError("Course not found.");
        }
      } catch (error) {
        setError("Something went wrong.");
        console.error("Error fetching course:", error);
      }
    };

    fetchCourse();
  }, [id]);

  const deleteCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (response.ok) {
        router.push("/courses");
      } else {
        setError(data.error || "Failed to delete course.");
      }
    } catch (error) {
      setError("Failed to delete course.");
      console.error("Error deleting course:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-left">
        {course ? (
          <>
            <h2 className="text-2xl font-bold text-black mb-4"><span>Course: </span>{course.name}</h2>
            <p className="text-black">Credits: {course.credits}</p>
            <p className="text-black">Semester: {course.semester}</p>
            <p className="text-black">Department: {course.Department ? course.Department.name : "Unknown"}</p>
            <div className="flex py-2 align-center justify-between">
              <button
                onClick={() => router.push(`/courses/${id}/update`)}
                className="w-[49%] h-10 py-2 px-3 bg-yellow-500 text-md text-white font-semibold rounded-md hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50"
              >
                Edit Course
              </button>
              <button
                onClick={() => deleteCourse()}
                className="w-[49%] h-10 py-2 px-3 bg-red-500 text-md text-white font-semibold rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
              >
                Delete Course
              </button>
            </div>
            <button
              onClick={() => router.back()}
              className="w-full py-2 px-4 bg-blue-500 text-md text-white font-semibold rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 mb-4"
            >
              Go Back
            </button>
            <p className="text-red-500 text-center font-semibold">{error}</p>
          </>
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
}
